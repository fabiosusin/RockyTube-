using DAO.Databases;
using System.Collections.Generic;

namespace DAO.Input
{
    public class SaleInput
    {
        public string UserId { get; set; }
        public List<string> ProductsId { get; set; }
        public Address Destination { get; set; }

        public bool InvalidAddress() => Destination == null || string.IsNullOrEmpty(Destination.City) || string.IsNullOrEmpty(Destination.Neighborhood)
            || string.IsNullOrEmpty(Destination.Street) || string.IsNullOrEmpty(Destination.State) || string.IsNullOrEmpty(Destination.Number)
            || string.IsNullOrEmpty(Destination.ZipCode);
    }

}
