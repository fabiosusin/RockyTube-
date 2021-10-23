using MongoDB.Bson.Serialization.Attributes;
using System;

namespace DAO.Databases
{
    public class Sale : Base
    {
        public DateTime RegistryDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string UserId { get; set; }
        public decimal Total { get; set; }
        public Address Destination { get; set; }

        [BsonIgnore]
        public string UserName { get; set; }
    }
}


