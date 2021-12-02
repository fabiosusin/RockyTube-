namespace Repository.Settings
{
    public class RockyTubeDatabaseSettings : IRockyTubeDatabaseSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IRockyTubeDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}