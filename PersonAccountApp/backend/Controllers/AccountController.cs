using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonAccountApp.Data;
using PersonAccountApp.DTOs;
using PersonAccountApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PersonAccountApp.Controllers
{
    [Route("api/[controller]s")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccounts()
        {
            var accounts = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Status)
                .ToListAsync();
                
            // Map to DTO
            var accountDtos = accounts.Select(a => new AccountDto
            {
                code = a.Code,
                person_code = a.PersonCode,
                account_number = a.AccountNumber,
                outstanding_balance = a.OutstandingBalance,
                status_code = a.StatusCode,
                person = a.Person != null ? new PersonDto
                {
                    code = a.Person.Code,
                    name = a.Person.Name,
                    surname = a.Person.Surname,
                    id_number = a.Person.IdNumber
                } : null,
                status = a.Status != null ? new StatusDto
                {
                    code = a.Status.Code,
                    name = a.Status.Name
                } : null
            }).ToList();
            
            return accountDtos;
        }

        // GET: api/Accounts/5
        [HttpGet("{code}")]
        public async Task<ActionResult<AccountDto>> GetAccount(int code)
        {
            var account = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Status)
                .Include(a => a.Transactions)
                .FirstOrDefaultAsync(a => a.Code == code);

            if (account == null)
            {
                return NotFound();
            }

            // Map to DTO
            var accountDto = new AccountDto
            {
                code = account.Code,
                person_code = account.PersonCode,
                account_number = account.AccountNumber,
                outstanding_balance = account.OutstandingBalance,
                status_code = account.StatusCode,
                person = account.Person != null ? new PersonDto
                {
                    code = account.Person.Code,
                    name = account.Person.Name,
                    surname = account.Person.Surname,
                    id_number = account.Person.IdNumber
                } : null,
                status = account.Status != null ? new StatusDto
                {
                    code = account.Status.Code,
                    name = account.Status.Name
                } : null,
                transactions = account.Transactions?.Select(t => new TransactionDto
                {
                    code = t.Code,
                    account_code = t.AccountCode,
                    transaction_date = t.TransactionDate,
                    capture_date = t.CaptureDate,
                    amount = t.Amount,
                    description = t.Description
                }).ToList()
            };

            return accountDto;
        }

        // GET: api/Accounts/Person/5
        [HttpGet("Person/{personCode}")]
        public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccountsByPerson(int personCode)
        {
            var accounts = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Status)
                .Where(a => a.PersonCode == personCode)
                .ToListAsync();
                
            // Map to DTO
            var accountDtos = accounts.Select(a => new AccountDto
            {
                code = a.Code,
                person_code = a.PersonCode,
                account_number = a.AccountNumber,
                outstanding_balance = a.OutstandingBalance,
                status_code = a.StatusCode,
                person = a.Person != null ? new PersonDto
                {
                    code = a.Person.Code,
                    name = a.Person.Name,
                    surname = a.Person.Surname,
                    id_number = a.Person.IdNumber
                } : null,
                status = a.Status != null ? new StatusDto
                {
                    code = a.Status.Code,
                    name = a.Status.Name
                } : null
            }).ToList();
            
            return accountDtos;
        }

        // POST: api/Accounts
        [HttpPost]
        public async Task<ActionResult<AccountDto>> PostAccount(AccountDto accountDto)
        {
            var account = new Account
            {
                PersonCode = accountDto.person_code,
                AccountNumber = accountDto.account_number,
                OutstandingBalance = accountDto.outstanding_balance,
                StatusCode = accountDto.status_code
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // Reload the account with related data
            account = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Status)
                .FirstOrDefaultAsync(a => a.Code == account.Code);

            // Map to DTO for response
            var responseDto = new AccountDto
            {
                code = account.Code,
                person_code = account.PersonCode,
                account_number = account.AccountNumber,
                outstanding_balance = account.OutstandingBalance,
                status_code = account.StatusCode,
                person = account.Person != null ? new PersonDto
                {
                    code = account.Person.Code,
                    name = account.Person.Name,
                    surname = account.Person.Surname,
                    id_number = account.Person.IdNumber
                } : null,
                status = account.Status != null ? new StatusDto
                {
                    code = account.Status.Code,
                    name = account.Status.Name
                } : null
            };

            return CreatedAtAction("GetAccount", new { code = account.Code }, responseDto);
        }

        // PUT: api/Accounts/5
        [HttpPut("{code}")]
        public async Task<IActionResult> PutAccount(int code, AccountDto accountDto)
        {
            if (code != accountDto.code)
            {
                return BadRequest();
            }

            var account = await _context.Accounts.FindAsync(code);
            if (account == null)
            {
                return NotFound();
            }

            // Update account properties
            account.StatusCode = accountDto.status_code;
            // Don't update PersonCode or AccountNumber as they are key identifiers
            // Don't update OutstandingBalance as it should only be changed via transactions

            _context.Entry(account).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(code))
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

        // DELETE: api/Accounts/5
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteAccount(int code)
        {
            var account = await _context.Accounts.FindAsync(code);
            if (account == null)
            {
                return NotFound();
            }

            // Check if account has transactions
            var hasTransactions = await _context.Transactions.AnyAsync(t => t.AccountCode == code);
            if (hasTransactions)
            {
                return BadRequest("Cannot delete account with transactions");
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AccountExists(int code)
        {
            return _context.Accounts.Any(e => e.Code == code);
        }
    }
} 