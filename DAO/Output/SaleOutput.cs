using DAO.Databases;
using System.Collections.Generic;

namespace DAO.Output
{
    public class SaleOutput
    {
        public Sale Sale { get; set; }
        public List<Product> Products { get; set; }
    }
}
