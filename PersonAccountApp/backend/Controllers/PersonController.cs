using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonAccountApp.Data;
using PersonAccountApp.DTOs;
using PersonAccountApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PersonAccountApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PersonController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Person
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonDto>>> GetPersons()
        {
            var persons = await _context.Persons.ToListAsync();
            
            // Map to DTO
            var personDtos = persons.Select(p => new PersonDto
            {
                code = p.Code,
                name = p.Name,
                surname = p.Surname,
                id_number = p.IdNumber
            }).ToList();
            
            return personDtos;
        }

        // GET: api/Person/5
        [HttpGet("{code}")]
        public async Task<ActionResult<PersonDto>> GetPerson(int code)
        {
            var person = await _context.Persons
                .Include(p => p.Accounts)
                .FirstOrDefaultAsync(p => p.Code == code);

            if (person == null)
            {
                return NotFound();
            }

            // Map to DTO
            var personDto = new PersonDto
            {
                code = person.Code,
                name = person.Name,
                surname = person.Surname,
                id_number = person.IdNumber,
                accounts = person.Accounts?.Select(a => new AccountDto
                {
                    code = a.Code,
                    account_number = a.AccountNumber,
                    outstanding_balance = a.OutstandingBalance,
                    status_code = a.StatusCode
                }).ToList()
            };

            return personDto;
        }

        // POST: api/Person
        [HttpPost]
        public async Task<ActionResult<PersonDto>> PostPerson(PersonDto personDto)
        {
            var person = new Person
            {
                Name = personDto.name,
                Surname = personDto.surname,
                IdNumber = personDto.id_number
            };

            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            personDto.code = person.Code;

            return CreatedAtAction("GetPerson", new { code = person.Code }, personDto);
        }

        // PUT: api/Person/5
        [HttpPut("{code}")]
        public async Task<IActionResult> PutPerson(int code, PersonDto personDto)
        {
            if (code != personDto.code)
            {
                return BadRequest();
            }

            var person = await _context.Persons.FindAsync(code);
            if (person == null)
            {
                return NotFound();
            }

            // Update person properties
            person.Name = personDto.name;
            person.Surname = personDto.surname;
            person.IdNumber = personDto.id_number;

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(code))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Person/5
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeletePerson(int code)
        {
            var person = await _context.Persons.FindAsync(code);
            if (person == null)
            {
                return NotFound();
            }

            _context.Persons.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonExists(int code)
        {
            return _context.Persons.Any(e => e.Code == code);
        }
    }
} 