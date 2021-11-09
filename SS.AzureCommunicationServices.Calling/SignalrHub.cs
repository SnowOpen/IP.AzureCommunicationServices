using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Calling
{
    public class SignalrHub : Hub
    {
        public class Subtitle
        {
            public string LineId { set; get; }
            public string UserName { set; get; }
            public string CnText { set; get; }
            public string EnText { set; get; }
            public string OriginalLanguage { set; get; }
            public string LocalTime { set; get; }
        }

        public override async Task OnConnectedAsync()
        {
            var groupId = GetGroupId();
            await Task.Delay(50);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            var groupId = GetGroupId();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId.ToString());
            await base.OnDisconnectedAsync(exception);
        }

        public async Task sendSubtitle(Subtitle subTitle)
        {
            var groupId = GetGroupId();
            await Clients.OthersInGroup(groupId).SendAsync("ReceiveSubtitle", subTitle);
        }

        public string GetGroupId()
        {
            var groupId = GetQuery("groupId");
            return groupId;
        }
        public string GetQuery(string key, string defaultValue = "")
        {
            if (Context.GetHttpContext()?.Request == null)
            {
                return defaultValue;
            }
            var values = Context.GetHttpContext()?.Request.Query[key];
            return values?.ToString();
        }
    }
}
