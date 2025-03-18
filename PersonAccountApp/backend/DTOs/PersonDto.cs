using System.Collections.Generic;

namespace PersonAccountApp.DTOs
{
    public class PersonDto
    {
        public int code { get; set; }
        public string? name { get; set; }
        public string? surname { get; set; }
        public string id_number { get; set; } = string.Empty;
        public List<AccountDto>? accounts { get; set; }
    }
} 