using System;

namespace PersonAccountApp.DTOs
{
    public class TransactionDto
    {
        public int code { get; set; }
        public int account_code { get; set; }
        public DateTime transaction_date { get; set; }
        public DateTime capture_date { get; set; }
        public decimal amount { get; set; }
        public string description { get; set; } = string.Empty;
        public AccountDto? account { get; set; }
    }
} 