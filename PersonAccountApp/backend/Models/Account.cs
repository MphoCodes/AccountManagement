using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonAccountApp.Models
{
    public class Account
    {
        [Key]
        public int Code { get; set; }
        
        [Required]
        [Column("person_code")]
        public int PersonCode { get; set; }
        
        [Required]
        [StringLength(50)]
        [Column("account_number")]
        public string AccountNumber { get; set; } = string.Empty;
        
        [Required]
        [Column("outstanding_balance", TypeName = "money")]
        public decimal OutstandingBalance { get; set; }
        
        [Required]
        [Column("status_code")]
        public int StatusCode { get; set; } = 1; // Default to 'Open'
        
        [ForeignKey("PersonCode")]
        public virtual Person? Person { get; set; }
        
        [ForeignKey("StatusCode")]
        public virtual Status? Status { get; set; }
        
        public virtual ICollection<Transaction>? Transactions { get; set; }
    }
} 