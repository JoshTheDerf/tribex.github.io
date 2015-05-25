// The MIT License (MIT)
//
// Copyright (c) 2015 Andrew Hood
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(global) {

  var GITHUB_API_BASE_URL = "https://api.github.com/";
  var GITHUB_BASE_URL = "https://github.com/";

  global.GithubActivityFeed = function(username) {
    var self = this;

    self.user = $.Deferred();
    self.events = $.Deferred();

    $.ajax({
      url: GITHUB_API_BASE_URL + "users/" + username + "/events",
      dataType: "jsonp"
    }).done(function(events, status, jqXHR) {
      self.resolve_events(events, jqXHR.status);
    });

    $.ajax({
      url: GITHUB_API_BASE_URL + "users/" + username,
      dataType: "jsonp",
    }).done(function(data, status, jqXHR) {
      self.resolve_user(data, jqXHR.status);
    });

    self.abbr_sha = function(sha) {
      return self.truncate(sha, 6, false);
    };

    self.action = function(payload) {
      return payload.action;
    };

    self.author = function(event) {
      return event.actor.login;
    };

    self.author_link = function(event) {
      return self.link(self.github_url(self.author(event)), self.author(event));
    };

    self.build_icon = function(icon_type) {
      return "<span class='" + icon_type + "'></span>";
    };

    self.commit_comment_url = function(comment) {
      return comment.html_url;
    };
self.convert_api_url = function(url) { return self.github_url(self.remove_api_url(url));
    };

    self.details_GollumEvent = function(event) {
      var details = [];
      var pages = event.payload.pages;
      for(var i = 0; i < pages.length; i++) {
        details.push(pages[i].action + self.pad(pages[i].page_name));
      }
      return details;
    };

    self.details_IssueCommentEvent = function(event) {
      var details = [];
      details.push(event.payload.comment.body);
      return details;
    };

    self.details_IssuesEvent = function(event) {
      var details = [];
      details.push(event.payload.issue.title);
      return details;
    };

    self.details_PullRequestEvent = function(event) {
      var details = [];
      details.push(event.payload.pull_request.title);
      return details;
    };

    self.details_PushEvent = function(event) {
      var details = [];
      for (var i = 0; i < event.payload.commits.length; i++) {
        var commit = event.payload.commits[i];
        details.push(
          self.link(self.convert_api_url(commit.url), self.abbr_sha(commit.sha)) + " " + self.truncate(commit.message));
      }
      return details;
    };

    self.forkee_link = function(forkee) {
      return self.link(self.github_url(forkee.full_name), forkee.full_name);
    };

    self.gh_event = function(icon, text, event, details) {
      return {
        icon: self.build_icon(icon),
        text: text,
        timeago: self.time_since(event),
        details: details
      };
    };

    self.gh_parse_CommitCommentEvent = function(event) {
      return self.gh_event('mega-octicon octicon-comment-discussion',
        self.author_link(event) + self.pad("commented on commit") + self.link(self.commit_comment_url(event.payload.comment), self.repo_at_hash(event)),
        event, [event.payload.comment.body]);
    };

    self.gh_parse_CreateEvent = function(event) {
      if (event.payload.ref_type === "repository") {
        return self.gh_parse_CreateEvent_repository(event);
      }
      return self.gh_parse_CreateEvent_tag(event);
    };

    self.gh_parse_CreateEvent_repository = function(event) {
      return self.gh_event('octicon octicon-repo',
        self.author_link(event) + " created repository " + self.repository_link(event),
        event);
    };

    self.gh_parse_CreateEvent_tag = function(event) {
      return self.gh_event('octicon octicon-tag',
        self.author_link(event) + " created tag " + self.ref_link(event) + " at " + self.repository_link(event),
        event);
    };

    self.gh_parse_DeleteEvent = function(event) {
      return self.gh_event('octicon octicon-git-branch-delete',
        self.author_link(event) + " deleted " + self.ref_type(event.payload) + " " + self.ref(event.payload) + " at " + self.repository_link(event),
        event);
    };

    self.gh_parse_ForkEvent = function(event) {
      return self.gh_event('octicon octicon-git-branch',
        self.author_link(event) + " forked " + self.repository_link(event) + " to " + self.forkee_link(event.payload.forkee),
        event);
    };

    self.gh_parse_GollumEvent = function(event) {
      return self.gh_event('mega-octicon octicon-book',
        self.author_link(event) + self.pad("edited") + self.link(self.convert_api_url(event.repo.url) + "/wiki", self.repository(event.repo) + "@wiki"),
        event,
        self.details_GollumEvent(event));
    };

    self.gh_parse_IssueCommentEvent = function(event) {
      return self.gh_event('mega-octicon octicon-comment-discussion',
        self.author_link(event) + " commened on pull request " + self.repository_link(event),
        event,
        self.details_IssueCommentEvent(event));
    };

    self.gh_parse_IssuesEvent = function(event) {
      var action = "closed";
      if (event.payload.action === "opened") {
        action = "opened";
      }
      return self.gh_event('mega-octicon octicon-issue-' + action,
        self.author_link(event) + " " + action + " issue " + self.repository_link(event),
        event,
        self.details_IssuesEvent(event));
    };

    self.gh_parse_MemberEvent = function(event) {
      return self.gh_event('octicon octicon-organization',
        self.author_link(event) + self.pad(self.action(event.payload)) + self.member_link(event.payload.member) + self.pad("to") + self.repository_link(event),
        event);
    };

    self.gh_parse_PushEvent = function(event) {
      return self.gh_event('mega-octicon octicon-git-commit',
        self.author_link(event) + " pushed to " + self.ref_link(event) + " at " + self.repository_link(event),
        event,
        self.details_PushEvent(event));
    };

    self.gh_parse_PullRequestEvent = function(event) {
      if (self.pull_request_closed(event.payload)) {
        return self.gh_parse_PullRequestEvent_closed(event);
      }
      return self.gh_event('mega-octicon octicon-git-pull-request',
        self.author_link(event) + " " + self.action(event.payload) + " pull request " + self.pull_request_link(event.payload.pull_request),
        event,
        self.details_PullRequestEvent(event));
    };

    self.gh_parse_PullRequestEvent_closed = function(event) {
      var action = " closed ";
      if (event.payload.pull_request.merged) {
        action = " merged ";
      }
      return self.gh_event('mega-octicon octicon-git-pull-request',
        self.author_link(event) + action + "pull request " + self.pull_request_link(event.payload.pull_request),
        event,
        self.details_PullRequestEvent(event));
    };

    self.gh_parse_WatchEvent = function(event) {
      return self.gh_event('octicon octicon-star',
        self.author_link(event) + " starred " + self.repository_link(event),
        event);
    };

    self.gh_parse_UnknownEvent = function(event) {
      return self.gh_event('mega-octicon octicon-bug', event.type + " not yet implemented. Submit an <a href='https://github.com/andrewhood125/github-activity-feed/issues/new?title=" + event.type + "'>issue</a>!", event);
    };

    self.github_url = function(resource) {
      return GITHUB_BASE_URL + resource;
    };

    self.human_readable = function(data) {
      var events = [];
      for (var i = 0; i < data.length; i++) {
        var fn = self["gh_parse_" + data[i].type];
        if (typeof fn === "function") {
          events[i] = fn(data[i]);
        } else {
          events[i] = self.gh_parse_UnknownEvent(data[i]);
        }
      }
      return events;
    };

    self.link = function(url, name) {
      return "<a href='" + url + "'>" + name + "</a>";
    };

    self.member = function(member) {
      return member.login;
    };

    self.member_link = function(member) {
      return self.user_link(self.member(member));
    };

    self.pad = function(string) {
      return " " + string + " ";
    };

    self.pull_request_closed = function(payload) {
      if (payload.action === "closed") {
        return true;
      }
      return false;
    };

    self.pull_request_link = function(pull_request) {
      return self.link(pull_request._links.html.href, pull_request.title);
    };

    self.rate_limit_exceeded = function(meta) {
      if (meta["X-RateLimit-Remaining"] === "0") {
        return true;
      }
      return false;
    };

    self.ref = function(payload) {
      return payload.ref.replace("refs/heads/", '');
    };

    self.ref_link = function(event) {
      return self.link(self.github_url(self.repository(event.repo) + "/tree/" + self.ref(event.payload)), self.ref(event.payload));
    };

    self.ref_type = function(payload) {
      return payload.ref_type;
    };

    self.reject_rate_exceeded = function(call) {
      call.data.message += "\nRate limit reset " + self.time_until_api_refresh(call.meta);
    };

    self.remove_api_url = function remove_api_url(url) {
      return url.replace(GITHUB_API_BASE_URL, '').replace("repos/", '');
    };

    self.repo_at_hash = function(event) {
      return event.repo.name + "@" + self.truncate(event.payload.comment.commit_id, 6, false);
    };

    self.repository = function(repo) {
      return repo.name;
    };

    self.repository_link = function(event) {
      return self.link(self.convert_api_url(event.repo.url), self.repository(event.repo));
    };

    self.resolve_events = function(events, status) {
      if (self.rate_limit_exceeded(events.meta)) {
        self.reject_rate_exceeded(events);
        self.events.reject(events);
      }
      if (status !== 200) {
        self.events.reject({
          data: {
            message: "Failed to retrieve events info from GitHub"
          }
        });
      }
      return self.events.resolve({
        meta: events.meta,
        data: self.human_readable(events.data)
      });
    };


    self.resolve_user = function(user, status) {
      if (self.rate_limit_exceeded(user.meta)) {
        self.reject_rate_exceeded(user);
        self.user.reject(user);
      }
      if (status !== 200) {
        self.user.reject({
          data: {
            message: "Failed to retrieve user info from GitHub"
          }
        });
      }
      return self.user.resolve(user);
    };

    self.time_since = function(event) {
      return "<span class='timeago'> " + moment(event.created_at).fromNow() + "</span>";
    };

    self.time_until_api_refresh = function(meta) {
      var epoch = 1000 * parseInt(meta['X-RateLimit-Reset']);
      return moment(epoch).fromNow();
    };

    self.truncate = function(string, length, dots) {
      length = typeof length !== 'undefined' ? length : 50;
      dots = typeof dots !== 'undefined' ? dots : string.length > length;
      var short_string = string;
      if (string.length > length) {
        short_string = string.substring(0, length);
      }
      if (dots) {
        short_string += "...";
      }
      return short_string;
    };

    self.user_link = function(user) {
      return self.link(GITHUB_BASE_URL + user, user);
    };

  };

}(this));
