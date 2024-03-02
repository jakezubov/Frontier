using Microsoft.AspNetCore.Mvc;

namespace Frontier.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class JewelleryController : ControllerBase
    {
        private readonly ILogger<JewelleryController> _logger;

        public JewelleryController(ILogger<JewelleryController> logger)
        {
            _logger = logger;
        }
    }
}
