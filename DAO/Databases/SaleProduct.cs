namespace DAO.Databases
{
    public class SaleProduct : Base
    {
        public string Name { get; set; }
        public string SaleId { get; set; }
        public string CategoryId { get; set; }
        public string ProductId{ get; set; }
        public decimal Balance { get; set; }
        public decimal Price { get; set; }
    }
}


