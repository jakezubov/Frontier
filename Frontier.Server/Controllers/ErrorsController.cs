using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using Frontier.Server.Functions;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorsController : ControllerBase
    {
        private readonly ErrorLedgerDataAccess db = new();
        private readonly Misc functions = new();

        // Get All Error Logs
        [HttpGet]
        public async Task<IEnumerable<ErrorLedgerModel>> GetAllErrorLogs()
        {
            return await db.GetAllErrorLogs();
        }

        // Create An Error Log
        [HttpPost("create")]
        public async Task<IActionResult> CreateErrorLogs(ErrorLedgerModel newError)
        {
            await db.CreateErrorLog(newError);
            return Created();
        }

        // Delete An Error Log
        [HttpDelete("{base64ErrorId}/delete")]
        public async Task<IActionResult> DeleteErrorLog(string base64ErrorId)
        {
            if (base64ErrorId != null) {
                string errorId = functions.ConvertFromBase64(base64ErrorId);

                // Check if the error exists
                ErrorLedgerModel error = await db.GetErrorLog(errorId);
                if (error == null) return NotFound("Error not found");

                await db.DeleteErrorLog(errorId);
                return Ok();
            }
            return BadRequest("No Error Id Supplied");
        }
    }
}
