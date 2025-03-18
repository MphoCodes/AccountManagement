using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonAccountApp.Models
{
    public class Transaction
    {
        [Key]
        public int Code { get; set; }
        
        [Required]
        [Column("account_code")]
        public int AccountCode { get; set; }
        
        [Required]
        [Column("transaction_date")]
        public DateTime TransactionDate { get; set; }
        
        [Required]
        [Column("capture_date")]
        public DateTime CaptureDate { get; set; }
        
        [Required]
        [Column(TypeName = "money")]
        public decimal Amount { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Description { get; set; } = string.Empty;
        
        [ForeignKey("AccountCode")]
        public virtual Account? Account { get; set; }
    }
} 