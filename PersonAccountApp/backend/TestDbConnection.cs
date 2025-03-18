using System;
using System.Data.SqlClient;

namespace PersonAccountApp
{
    public class TestDbConnection
    {
        public static void Test(string connectionString)
        {
            Console.WriteLine($"Testing connection to: {connectionString}");
            
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    Console.WriteLine("Connection successful!");
                    
                    // Test if database exists
                    using (var command = new SqlCommand("SELECT DB_ID('AccountManagement')", connection))
                    {
                        var result = command.ExecuteScalar();
                        if (result != null && result != DBNull.Value)
                        {
                            Console.WriteLine("Database 'AccountManagement' exists.");
                        }
                        else
                        {
                            Console.WriteLine("Database 'AccountManagement' does not exist!");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Connection failed: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
} 