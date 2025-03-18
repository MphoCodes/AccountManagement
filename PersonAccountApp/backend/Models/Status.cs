using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonAccountApp.Models
{
    [Table("Status")]
    public class Status
    {
        [Key]
        [Column("code")]
        public int Code { get; set; }
        
        [Required]
        [StringLength(50)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        public virtual ICollection<Account>? Accounts { get; set; }
    }
} 