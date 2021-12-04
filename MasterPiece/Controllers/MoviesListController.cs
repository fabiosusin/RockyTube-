
using Business.Logic.Movies;
using DAO.Databases;
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
        private readonly BlUserMoviesList _blUserMoviesList;
        private readonly BlMoviesList _blMoviesList;
        public MoviesListController(IRockyTubeDatabaseSettings settings)
        {
            _blMoviesList = new BlMoviesList(settings);
            _blUserMoviesList = new BlUserMoviesList(settings);
        }

        [HttpPost, Route("List")]
        public IActionResult List([FromBody] FiltersMovies filtersproduct) => Ok(_blMoviesList.List(filtersproduct));

        [HttpPost, Route("user-movies-list")]
        public IActionResult ListUserMovies([FromBody] FiltersMovies filtersproduct) => Ok(_blUserMoviesList.GetUserMoviesList(filtersproduct));

        [HttpPost, Route("add-movie-list")]
        public IActionResult AddUserMovieList([FromBody] UserMovieList input) => Ok(_blUserMoviesList.Save(input));

        [HttpPost, Route("remove-movie-list")]
        public IActionResult RemoveUserMovieList([FromBody] UserMovieList input)
        {
            _blUserMoviesList.Delete(input);
            return Ok();
        }
    }
}
