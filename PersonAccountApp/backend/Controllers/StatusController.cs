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
    [Route("api/[controller]es")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatusController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Statuses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StatusDto>>> GetStatuses()
        {
            var statuses = await _context.Statuses.ToListAsync();
            
            // Map to DTO
            var statusDtos = statuses.Select(s => new StatusDto
            {
                code = s.Code,
                name = s.Name
            }).ToList();
            
            return statusDtos;
        }

        // GET: api/Statuses/5
        [HttpGet("{code}")]
        public async Task<ActionResult<StatusDto>> GetStatus(int code)
        {
            var status = await _context.Statuses.FindAsync(code);

            if (status == null)
            {
                return NotFound();
            }

            // Map to DTO
            var statusDto = new StatusDto
            {
                code = status.Code,
                name = status.Name
            };

            return statusDto;
        }
    }
} 