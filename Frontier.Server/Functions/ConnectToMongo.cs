using MongoDB.Driver;

namespace Frontier.Server.Functions
{
    public class ConnectToMongo(IConfiguration configuration)
    {
        public IMongoCollection<T> Connect<T>(in string collection)
        {
            MongoClient client = new(configuration["Mongo:ConnectionString"]);
            IMongoDatabase db = client.GetDatabase(configuration["Mongo:DatabaseName"]);
            return db.GetCollection<T>(collection);
        }
    }
}
