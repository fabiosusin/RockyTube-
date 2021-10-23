namespace Repository.Settings
{
    public class MasterPieceDatabaseSettings : IMasterPieceDatabaseSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IMasterPieceDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}