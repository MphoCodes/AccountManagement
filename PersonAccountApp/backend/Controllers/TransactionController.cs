using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonAccountApp.Data;
using PersonAccountApp.DTOs;
using PersonAccountApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PersonAccountApp.Controllers; // Add this to use DTOs from other controllers

namespace PersonAccountApp.Controllers
{
    [Route("api/[controller]s")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Account)
                .ThenInclude(a => a.Person)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();
                
            // Map to DTO
            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                code = t.Code,
                account_code = t.AccountCode,
                transaction_date = t.TransactionDate,
                capture_date = t.CaptureDate,
                amount = t.Amount,
                description = t.Description,
                account = t.Account != null ? new AccountDto
                {
                    code = t.Account.Code,
                    person_code = t.Account.PersonCode,
                    account_number = t.Account.AccountNumber,
                    outstanding_balance = t.Account.OutstandingBalance,
                    status_code = t.Account.StatusCode,
                    person = t.Account.Person != null ? new PersonDto
                    {
                        code = t.Account.Person.Code,
                        name = t.Account.Person.Name,
                        surname = t.Account.Person.Surname,
                        id_number = t.Account.Person.IdNumber
                    } : null
                } : null
            }).ToList();
            
            return transactionDtos;
        }

        // GET: api/Transactions/5
        [HttpGet("{code}")]
        public async Task<ActionResult<TransactionDto>> GetTransaction(int code)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Account)
                .ThenInclude(a => a.Person)
                .FirstOrDefaultAsync(t => t.Code == code);

            if (transaction == null)
            {
                return NotFound();
            }

            // Map to DTO
            var transactionDto = new TransactionDto
            {
                code = transaction.Code,
                account_code = transaction.AccountCode,
                transaction_date = transaction.TransactionDate,
                capture_date = transaction.CaptureDate,
                amount = transaction.Amount,
                description = transaction.Description,
                account = transaction.Account != null ? new AccountDto
                {
                    code = transaction.Account.Code,
                    person_code = transaction.Account.PersonCode,
                    account_number = transaction.Account.AccountNumber,
                    outstanding_balance = transaction.Account.OutstandingBalance,
                    status_code = transaction.Account.StatusCode,
                    person = transaction.Account.Person != null ? new PersonDto
                    {
                        code = transaction.Account.Person.Code,
                        name = transaction.Account.Person.Name,
                        surname = transaction.Account.Person.Surname,
                        id_number = transaction.Account.Person.IdNumber
                    } : null
                } : null
            };

            return transactionDto;
        }

        // GET: api/Transactions/Account/5
        [HttpGet("Account/{accountCode}")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByAccount(int accountCode)
        {
            var transactions = await _context.Transactions
                .Include(t => t.Account)
                .ThenInclude(a => a.Person)
                .Where(t => t.AccountCode == accountCode)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();
                
            // Map to DTO
            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                code = t.Code,
                account_code = t.AccountCode,
                transaction_date = t.TransactionDate,
                capture_date = t.CaptureDate,
                amount = t.Amount,
                description = t.Description,
                account = t.Account != null ? new AccountDto
                {
                    code = t.Account.Code,
                    person_code = t.Account.PersonCode,
                    account_number = t.Account.AccountNumber,
                    outstanding_balance = t.Account.OutstandingBalance,
                    status_code = t.Account.StatusCode,
                    person = t.Account.Person != null ? new PersonDto
                    {
                        code = t.Account.Person.Code,
                        name = t.Account.Person.Name,
                        surname = t.Account.Person.Surname,
                        id_number = t.Account.Person.IdNumber
                    } : null
                } : null
            }).ToList();
            
            return transactionDtos;
        }

        // POST: api/Transactions
        [HttpPost]
        public async Task<ActionResult<TransactionDto>> PostTransaction(TransactionDto transactionDto)
        {
            var transaction = new Transaction
            {
                AccountCode = transactionDto.account_code,
                TransactionDate = transactionDto.transaction_date,
                Amount = transactionDto.amount,
                Description = transactionDto.description,
                // Set capture date to current time
                CaptureDate = DateTime.Now
            };

            // Start a transaction to ensure atomicity
            using var dbTransaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Add the transaction
                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                // Update the account balance
                var account = await _context.Accounts.FindAsync(transaction.AccountCode);
                if (account == null)
                {
                    return NotFound("Account not found");
                }

                // Update the account balance
                account.OutstandingBalance += transaction.Amount;
                await _context.SaveChangesAsync();

                // Commit the transaction
                await dbTransaction.CommitAsync();

                // Reload the transaction with related data
                transaction = await _context.Transactions
                    .Include(t => t.Account)
                    .ThenInclude(a => a.Person)
                    .FirstOrDefaultAsync(t => t.Code == transaction.Code);

                // Map to DTO for response
                var responseDto = new TransactionDto
                {
                    code = transaction.Code,
                    account_code = transaction.AccountCode,
                    transaction_date = transaction.TransactionDate,
                    capture_date = transaction.CaptureDate,
                    amount = transaction.Amount,
                    description = transaction.Description,
                    account = transaction.Account != null ? new AccountDto
                    {
                        code = transaction.Account.Code,
                        person_code = transaction.Account.PersonCode,
                        account_number = transaction.Account.AccountNumber,
                        outstanding_balance = transaction.Account.OutstandingBalance,
                        status_code = transaction.Account.StatusCode,
                        person = transaction.Account.Person != null ? new PersonDto
                        {
                            code = transaction.Account.Person.Code,
                            name = transaction.Account.Person.Name,
                            surname = transaction.Account.Person.Surname,
                            id_number = transaction.Account.Person.IdNumber
                        } : null
                    } : null
                };

                return CreatedAtAction("GetTransaction", new { code = transaction.Code }, responseDto);
            }
            catch (Exception)
            {
                // Rollback the transaction in case of any error
                await dbTransaction.RollbackAsync();
                throw;
            }
        }

        // PUT: api/Transactions/5
        [HttpPut("{code}")]
        public async Task<IActionResult> PutTransaction(int code, Transaction transaction)
        {
            if (code != transaction.Code)
            {
                return BadRequest();
            }

            // This is a simplified implementation
            // In a real-world scenario, you would need to handle the account balance adjustment
            // based on the difference between the old and new transaction amounts
            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(code))
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

        // DELETE: api/Transactions/5
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteTransaction(int code)
        {
            // In a real-world financial system, deleting transactions is usually not allowed
            // Instead, you would create a reversal transaction
            // This is a simplified implementation for demo purposes
            
            var transaction = await _context.Transactions.FindAsync(code);
            if (transaction == null)
            {
                return NotFound();
            }

            // Start a transaction to ensure atomicity
            using var dbTransaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Update the account balance (reverse the effect of the transaction)
                var account = await _context.Accounts.FindAsync(transaction.AccountCode);
                if (account == null)
                {
                    return NotFound("Account not found");
                }

                // Reverse the effect on the account balance
                account.OutstandingBalance -= transaction.Amount;
                
                // Remove the transaction
                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();

                // Commit the transaction
                await dbTransaction.CommitAsync();

                return NoContent();
            }
            catch (Exception)
            {
                // Rollback the transaction in case of any error
                await dbTransaction.RollbackAsync();
                throw;
            }
        }

        private bool TransactionExists(int code)
        {
            return _context.Transactions.Any(e => e.Code == code);
        }
    }
} 