using DAO.Databases;
using System.Collections.Generic;

namespace DAO.Input
{
    public class FiltersMovies
    {
        public string MovieName { get; set; }
        public string UserId { get; set; }
        public string MovieId { get; set; }
        public bool HasPicture { get; set; }
        public string CategoryId { get; set; }
        public List<string> Ids { get; set; }

        // Ajuste de pesquisa, como limite de resultado e ordenações
        public int Limit { get; set; }
        public int Page { get; set; }
        public OrderBy OrderBy { get; set; }
    }

    public class OrderBy
    {
        public bool BestSeller { get; set; }
        public bool MostCategoryItems { get; set; }
    }
}
