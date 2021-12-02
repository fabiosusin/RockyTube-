using Business.Logic.Movies;
using DAO.Databases;
using Microsoft.AspNetCore.Mvc;
using Repository.Settings;

namespace RockyTube.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesRegisterController : ControllerBase
    {
        private readonly BlMovies _blMovies;
        public MoviesRegisterController(IRockyTubeDatabaseSettings settings)
        {
            _blMovies = new BlMovies(settings);
        }

        [HttpPost, Route("Create")]
        public IActionResult Create([FromBody] Movie movie) => Ok(_blMovies.Save(movie));


        [HttpPost, Route("Delete")]
        public IActionResult Delete(string id)
        {
            _blMovies.Delete(_blMovies.GetById(id));
            return Ok();
        }
    }
}

