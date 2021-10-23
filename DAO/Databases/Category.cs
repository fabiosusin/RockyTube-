namespace DAO.Databases
{
    public class Category : Base
    {
        public Category() { }
        public Category(string name)
        {
            Name = name;
        }

        public string Name { get; set; }
    }
}


