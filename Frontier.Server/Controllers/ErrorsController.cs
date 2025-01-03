using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorsController : ControllerBase
    {
        private readonly ErrorLedgerDataAccess db = new();

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
        [HttpDelete("{errorId}/delete")]
        public async Task<IActionResult> DeleteErrorLog(string errorId)
        {
            // Check if the error exists
            ErrorLedgerModel error = await db.GetErrorLog(errorId);
            if (error == null) return NotFound("Error not found");

            await db.DeleteErrorLog(errorId);
            return Created();
        }
    }
}
