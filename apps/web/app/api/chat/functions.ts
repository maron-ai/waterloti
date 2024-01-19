import { ChatCompletionCreateParams } from "openai/resources/chat/index";

type PeriodType = 'past_24_hours' | 'past_week' | 'past_month' | 'past_3_months'
type LanguageType = 'All' | 'JavaScript' | 'Java' | 'Python' | 'PHP' | 'C++' | 'C#' | 'TypeScript' | 'Shell' | 'C' | 'Ruby' | 'Rust' | 'Go' | 'Kotlin' | 'HCL' | 'PowerShell' | 'CMake' | 'Groovy' | 'PLpgSQL' | 'TSQL' | 'Dart' | 'Swift' | 'HTML' | 'CSS' | 'Elixir' | 'Haskell' | 'Solidity' | 'Assembly' | 'R' | 'Scala' | 'Julia' | 'Lua' | 'Clojure' | 'Erlang' | 'Common Lisp' | 'Emacs Lisp' | 'OCaml' | 'MATLAB' | 'Objective-C' | 'Perl' | 'Fortran';

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "get_trending_repos",
    description:
      "Get the top trending repos from Github.",
    parameters: {
      type: "object",
      properties: {
        language: {
          type: "string",
          enum: ['All', 'JavaScript', 'Java', 'Python', 'PHP', 'C++', 'C#', 'TypeScript', 'Shell', 'C', 'Ruby', 'Rust', 'Go', 'Kotlin', 'HCL', 'PowerShell', 'CMake', 'Groovy', 'PLpgSQL', 'TSQL', 'Dart', 'Swift', 'HTML', 'CSS', 'Elixir', 'Haskell', 'Solidity', 'Assembly', 'R', 'Scala', 'Julia', 'Lua', 'Clojure', 'Erlang', 'Common Lisp', 'Emacs Lisp', 'OCaml', 'MATLAB', 'Objective-C', 'Perl', 'Fortran'],
          description: "Specify using which programming language to filter trending repos. If not specified, all languages will be included.",
        },
        period: {
          type: "string",
          enum: ['past_24_hours', 'past_week', 'past_month', 'past_3_months'],
          description: "Specify the period of time to calculate trending repos. Possible values: [past_24_hours, past_week, past_month, past_3_months]",
        },
        limit: {
          type: "number",
          description: "The number of repos to return. Defaults to 10.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_repo_stargazers_stats",
    description:
      "List countries/regions of stargazers for the specified repository.",
    parameters: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "The owner of the repo.",
        },
        repo: {
          type: "string",
          description: "The name of the repo.",
        },
      },
      required: ["owner", 'repo'],
    },
  },
];


async function get_trending_repos(limit: number = 10, period: PeriodType = 'past_24_hours', language: LanguageType = 'All') {
  const response = await fetch(
    `https://api.ossinsight.io/v1/trends/repos?period=${period}&language=${language}`,
  );
  console.log(`https://api.ossinsight.io/v1/trends/repos?period=${period}&language=${language}`)
  const { data } = await response.json();

  return {
    repos: data.rows.slice(0, limit).map((d: { repo_name: string; }) => {
      d.repo_name = `https://github.com/${d.repo_name}`
      return d;
    })
  };
}

async function get_repo_stargazers_stats(owner: string, repo: string) {
  const response = await fetch(
    `https://api.ossinsight.io/v1/repos/${owner}/${repo}/stargazers/countries/`,
  );
  const data = await response.json();
  return {
    ...data,
  };
}

export async function runFunction(name: string, args: any) {
  console.log(name, args, '.....')
  switch (name) {
    case "get_trending_repos":
      return await get_trending_repos();
    case "get_repo_stargazers_stats":
      return await get_repo_stargazers_stats(args['owner'], args['repo']);
    default:
      return null;
  }
}
