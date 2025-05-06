using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ErrorsController(ErrorLedgerDataAccess dbErrors) : ControllerBase
    {
        // Get All Error Logs
        [HttpGet]
        public async Task<IEnumerable<ErrorLedgerModel>> GetAllErrorLogs()
        {
            return await dbErrors.GetAllErrorLogs();
        }

        // Create An Error Log
        [HttpPost("create")]
        public async Task<IActionResult> CreateErrorLogs(ErrorLedgerModel newError)
        {
            await dbErrors.CreateErrorLog(newError);
            return Created();
        }

        // Delete An Error Log
        [HttpDelete("{errorId}/delete")]
        public async Task<IActionResult> DeleteErrorLog(string errorId)
        {
            // Check if the error exists
            ErrorLedgerModel error = await dbErrors.GetErrorLog(errorId);
            if (error == null) return NotFound("Error not found");

            await dbErrors.DeleteErrorLog(errorId);
            return Ok();
        }
    }
}
