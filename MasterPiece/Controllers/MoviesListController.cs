
using Business.Logic.Movies;
using DAO.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Settings;

namespace RockyTube.Controllers
{
    [Route("api/[controller]"), AllowAnonymous]
    [ApiController]
    public class MoviesListController : ControllerBase
    {
        private readonly BlMoviesList _blMoviesList;
        public MoviesListController(IRockyTubeDatabaseSettings settings) => _blMoviesList = new BlMoviesList(settings);

        [HttpPost, Route("List")]
        public IActionResult List([FromBody] FiltersMovies filtersproduct) => Ok(_blMoviesList.List(filtersproduct));
    }
}
