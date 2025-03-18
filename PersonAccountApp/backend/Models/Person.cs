using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonAccountApp.Models
{
    public class Person
    {
        [Key]
        public int Code { get; set; }
        
        [StringLength(50)]
        public string? Name { get; set; }
        
        [StringLength(50)]
        public string? Surname { get; set; }
        
        [Required]
        [StringLength(50)]
        [Column("id_number")]
        public string IdNumber { get; set; } = string.Empty;
        
        public virtual ICollection<Account>? Accounts { get; set; }
    }
} 