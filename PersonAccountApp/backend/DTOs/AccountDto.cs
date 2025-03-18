using System.Collections.Generic;

namespace PersonAccountApp.DTOs
{
    public class AccountDto
    {
        public int code { get; set; }
        public int person_code { get; set; }
        public string account_number { get; set; } = string.Empty;
        public decimal outstanding_balance { get; set; }
        public int status_code { get; set; }
        public PersonDto? person { get; set; }
        public StatusDto? status { get; set; }
        public List<TransactionDto>? transactions { get; set; }
    }
} 