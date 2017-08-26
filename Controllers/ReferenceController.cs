using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ReactDeployTool.Controllers
{
    [Route("api/[controller]")]
    public class ReferenceController : Controller
    {
        private static readonly Random Rnd = new Random();

        private static string[] EnvironmentNames = new[]
{
            "DEV 1", "DEV 2", "QA 1", "QA 2"
        };

        [HttpGet("[action]")]
        public IEnumerable<Environment> Environments()
        {
            return EnvironmentNames.Select(name => new Environment { Name = name });
        }

        [HttpGet("[action]")]
        public IEnumerable<Build> Builds([FromQuery]string mask)
        {
            var count = Rnd.Next(10, 20);

            return
                from i in Enumerable.Range(0, count)
                let date = DateTime.Today.AddDays(-i)
                let name = $"{mask}.Main.{date:yy_MM_dd}"
                let url = $"http://{mask}/{i}"
                select new Build { Name = name, Url = url };
        }

        public class Environment
        {
            public string Name { get; set; }
        }

        public class Build
        {
            public string Url { get; set; }
            public string Name { get; set; }
        }
    }
}
