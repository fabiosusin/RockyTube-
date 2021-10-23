namespace DAO.Input
{
    public class FiltersCategories
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool HasValidProducts { get; set; }
        public int? MinItems { get; set; }
        public int? MinSoldItems { get; set; }
    }
}
