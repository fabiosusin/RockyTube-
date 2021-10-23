using Business.Logic.Users;
using Business.Services;
using DAO.Databases;
using DAO.Input;
using DAO.Input.Filters;
using DAO.Output;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Settings;

namespace MasterPiece.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly BlUsers _blUsers;
        public UsersController(IMasterPieceDatabaseSettings settings)
        {
            _blUsers = new BlUsers(settings);
        }

        [HttpPost, Route("Create"), AllowAnonymous]
        public IActionResult Create([FromBody] User user)
        {
            _ = _blUsers.Save(user);
            return Ok(new SaveUserOutput
            {
                User = user,
                Token = TokenService.GenerateToken(user)
            });
        }

        [HttpPost, Route("Login"), AllowAnonymous]
        public IActionResult Login([FromBody] LoginInput user) => Ok(_blUsers.Login(user));

        [HttpPost, Route("All-Users")]
        public IActionResult Users([FromBody] UsersFilter filter) => Ok(_blUsers.List(filter));

        [HttpGet, Route("Get")]
        public IActionResult Get(string id) => Ok(_blUsers.Get(id));
    }
}
