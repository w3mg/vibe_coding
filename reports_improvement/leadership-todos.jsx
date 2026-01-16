import React, { useState } from 'react';

const resolvedIssues = [
  "L10s moved",
  "RM Quick Demo - Command Center, L10s, 1:1s, Projects",
  "AI Policy/Sign Off Quick Discussion",
  "need full description - Rec to FG ?",
  "BizDev/Inbound Sales KPI final sign off",
  "Scott inventory checklist/standards with LT for seats",
  "Update measurable ownership/clarify naming",
  "US Bank RFI - questions, concerns, alignment to core competencies, resources needed, roles and responsibilities",
  "I have about 1/2 of the metrics completed in charts, I need to complete the balance.",
  "Pipe Drive: automations broken",
  "Automation emails that are to be going to product sales are not working",
  "PLEASE REMOVE",
  "Scott add to LT 1:1s Source of truth on financials data",
  "Set up Measurable to track Product received is lower than desired",
  "Import from Bloom or from Spreadsheet",
  "Staffing remains an issue that Kris is working on",
  "CBRE - GRMS Business Continuity Management (BCM) Questionaire",
  "CDW / US Bank - Budgetary Pricing Template",
  "Bloom to ResultMaps transition",
  "Per Kent Focal - Wire issue - how can we prevent it, what process should be in place",
  "Process documentation that is Seat Critical - Updates",
  "scorecard forecasts in the spreadsheet",
  "Discuss where we are per kent as we move through",
  "Scott update the items still unassigned by EOD 11/20",
  "what should Kent communicate regarding the wirefraud",
  "Juice v. Squeeze on CDW/ Discussion",
  "Monthly Financials review",
  "Centralizing communication on next steps with Bloom",
  "Scott and Dbox to talk through ways to carve this down",
  "Discuss the new measurables and how we track it for Settlement Errors",
  "Is 150 pallets the right target, are we staffing right",
  "Scott and Robert to review the rock service offering around ai",
  "Scorecard Entry - Accounting Numbers",
  "We don't take action on this, examine an anlytics dashboard",
  "Nick frustrations",
  "Budgeting process updates from Lee",
  "People Issues - 4 weeks, 2 raised per week",
  "Quick check in - aside from our meeting today with Lee/Kent, are there any lingering budget deliverables that are late",
  "Budget Review Needs to Be Scheduled",
  "Financials Review with Lee",
  "talk through the importance of this item and balancing opportunities"
];

function isResolvedIssue(todoText) {
  const normalizedTodo = todoText.toLowerCase();
  return resolvedIssues.some(issue => {
    const normalizedIssue = issue.toLowerCase();
    return normalizedTodo.includes(normalizedIssue) || normalizedIssue.includes(normalizedTodo.substring(0, 40));
  });
}

const todosData = [
  {
    week: "Week 52 2025 - December 22",
    items: [
      { id: 1, text: "@Kent Bonus email to the company #next", completed: "12/23/2025", owner: "Kent Taggert" },
      { id: 2, text: "Talk through the importance of this item and balancing opportunities", completed: "12/23/2025", owner: "Robert Erwin", isResolved: true },
      { id: 3, text: "@leenester will provide SOP for how to send and receive wires and ACH (any electronic change) #next", completed: "12/23/2025", owner: "Lee Nester" },
      { id: 4, text: "Budget Review Needs to Be Scheduled - we'll resolve this if Kent/Lee approve next week", completed: "12/23/2025", owner: "Scott Levy", isResolved: true },
      { id: 5, text: "Report on sales hire candidate Matt D thursday #next", completed: "12/23/2025", owner: "Kris Roeskin" }
    ]
  },
  {
    week: "Week 51 2025 - December 15",
    items: [
      { id: 6, text: "Jeff give update next week on the items we are processing to bring the 14 at risk SLAs back down #next", completed: "12/21/2025", owner: "Scott Levy" },
      { id: 7, text: "@scottilevy to discuss with Jeff asset tag process - add this one to seat", completed: "12/18/2025", owner: "Scott Levy" },
      { id: 8, text: "@scottilevy and Robert to start the onboarding checklist (sop) for Transactional Business", completed: "12/17/2025", owner: "Scott Levy" },
      { id: 9, text: "@Jeffwithmender schedule Ops leader interview with Ashley, team #next", completed: "12/17/2025", owner: "Jeff Bell" },
      { id: 10, text: "Scorecard Entry - Accounting Numbers (Denice? Jeff?)", completed: "12/17/2025", owner: "Lee Nester", isResolved: true },
      { id: 11, text: "Scott to have this updated by next l10 - auto updated from Jeff or Dbox", completed: "12/17/2025", owner: "Scott Levy" },
      { id: 12, text: "We don't take action on this, examine an anlytics dashboard in the future asap", completed: "12/17/2025", owner: "Scott Levy", isResolved: true },
      { id: 13, text: "@Jeffwithmender digging into the 4 data errors this week in 1:1, report back on actions taken #next", completed: "12/17/2025", owner: "Jeff Bell" },
      { id: 14, text: "@Jeffwithmender will give a todo to yami and maha to add a list of settlements that cannot be settled into their l10 to report in LT l10 #next", completed: "12/17/2025", owner: "Jeff Bell" },
      { id: 15, text: "Get with Kris and Robert to establish pricing templates for service fees and comodity pricing...", completed: "12/17/2025", owner: "Jeff Bell" },
      { id: 16, text: "Update revenue/item sold with Jeff", completed: "12/17/2025", owner: "Scott Levy" },
      { id: 17, text: "People Issues - 4 weeks, 2 raised per week. SL to discuss the action plan there in the context Stabilize>Optimize>Scale", completed: "12/17/2025", owner: "Scott Levy", isResolved: true },
      { id: 18, text: "Financials Review with Lee", completed: "12/17/2025", owner: "Scott Levy", isResolved: true },
      { id: 19, text: "@Jeffwithmender reach out to Stacy to have all inbound load price values sent to You #next", completed: "12/16/2025", owner: "Jeff Bell" },
      { id: 20, text: "Quick check in - aside from our meeting today with Lee/Kent, are there any lingering budget deliverables that are late.", completed: "12/16/2025", owner: "Scott Levy", isResolved: true },
      { id: 21, text: "@brianc to get with Robert, Kent and Dbox to work out an email to send out re: avoiding fraud", completed: "12/16/2025", owner: "Brian Childers" },
      { id: 22, text: "Internal Ticket System for IT #next", completed: "12/16/2025", owner: "Brian Childers" },
      { id: 23, text: "[Robert] Define Client Requirements for ServiceNow Integration #next", completed: "12/16/2025", owner: "Robert Erwin" },
      { id: 24, text: "@Kent will take a pass at bonuses and distribute #next", completed: "12/15/2025", owner: "Kent Taggert" }
    ]
  },
  {
    week: "Week 50 2025 - December 08",
    items: [
      { id: 25, text: "[Robert] Distribute Q4 Document to EL team #next", completed: "12/14/2025", owner: "Robert Erwin" },
      { id: 26, text: "Nick frustrations", completed: "12/10/2025", owner: "Scott Levy", isResolved: true },
      { id: 27, text: "Process documentation that is Seat Critical - Updates", completed: "12/10/2025", owner: "Scott Levy", isResolved: true },
      { id: 28, text: "Project Plan for Operation Enema @Jeffwithmender #next", completed: "12/10/2025", owner: "Jeff Bell" },
      { id: 29, text: "Process the logistics pipeline to make sure our inbounds are valued correctly @Jeffwithmender so our pipelines (30 day and 90 day come up) #next", completed: "12/10/2025", owner: "Jeff Bell" },
      { id: 30, text: "Scott to whiteboard full process on quoting, client information getting in to our systems (from Dbox issues)", completed: "12/10/2025", owner: "Scott Levy" },
      { id: 31, text: "Scott inventory checklist/standards with LT for seats [pushed one week for our 1x1s]", completed: "12/10/2025", owner: "Scott Levy", isResolved: true },
      { id: 32, text: "Scott and Robert to review the rock service offering around ai", completed: "12/10/2025", owner: "Robert Erwin", isResolved: true },
      { id: 33, text: "Budgeting process updates from Lee/ updates from all", completed: "12/10/2025", owner: "Scott Levy", isResolved: true },
      { id: 34, text: "[Kent] ServiceNow Follow-up with Robert T for OMES #next", completed: "12/09/2025", owner: "Kent Taggert" },
      { id: 35, text: "[Kent] Integrate AI initiatives in 2026 Plan #next", completed: "12/09/2025", owner: "Kent Taggert" }
    ]
  },
  {
    week: "Week 49 2025 - December 01",
    items: [
      { id: 36, text: "[David] Create plan to improve/replace Gerardo #next", completed: "12/07/2025", owner: "David Box" },
      { id: 37, text: "[Kent] Incorporate Purpose into everyone's playbooks #next", completed: "12/04/2025", owner: "Kent Taggert" },
      { id: 38, text: "@leenester get with Kent to update our forecasts #next", completed: "12/04/2025", owner: "Lee Nester" },
      { id: 39, text: "Set up Measurable to track Product received is lower than desired, we want 75 per week average. peaks and valleys. relative when - what's the KPI", completed: "12/04/2025", owner: "Scott Levy", isResolved: true },
      { id: 40, text: "Scott and Dbox to talk through ways to carve this down", completed: "12/04/2025", owner: "David Box", isResolved: true },
      { id: 41, text: "Discuss the new measurables and how we track it for Settlement Errors to agree how we track", completed: "12/04/2025", owner: "Scott Levy", isResolved: true },
      { id: 42, text: "Centralizing communication on next steps with Bloom (quick heads up and discussion)", completed: "12/04/2025", owner: "Scott Levy", isResolved: true },
      { id: 43, text: "Is 150 pallets the right target, are we staffing right @Kent", completed: "12/04/2025", owner: "Kent Taggert", isResolved: true },
      { id: 44, text: "@brianc to provide update to Kent after talking with Paratech regarding the wirefraud (from L10 discussion)", completed: "12/04/2025", owner: "Brian Childers" },
      { id: 45, text: "[David] Incorporate Quoting and Value Maximization into process scoping with Scott #next", completed: "12/04/2025", owner: "David Box" },
      { id: 46, text: "BizDev/Inbound Sales KPI final sign off", completed: "12/03/2025", owner: "Scott Levy", isResolved: true },
      { id: 47, text: "Staffing remains an issue that Kris is working on - math of the days is tough; we need some whales", completed: "12/03/2025", owner: "Scott Levy", isResolved: true },
      { id: 48, text: "@Kent to join or delegate joining ASCDI and UNEDA, and try again on global ICT what's app #next", completed: "12/03/2025", owner: "Kent Taggert" },
      { id: 49, text: "Discuss with Brian and Kent who is sending our regular electronic transfer email to customers", completed: "12/02/2025", owner: "Scott Levy" },
      { id: 50, text: "Identify at least one Inbound Sales Candidate and intro Kris @brianc", completed: "12/02/2025", owner: "Brian Childers" },
      { id: 51, text: "Scott - Review CEO JD and Propose Seat", completed: "12/02/2025", owner: "Scott Levy" },
      { id: 52, text: "@brianc to educate scott on how we stop spoofing #next", completed: "12/02/2025", owner: "Brian Childers" },
      { id: 53, text: "@dbox review scorecard rock with scott in 1x1", completed: "12/02/2025", owner: "David Box" },
      { id: 54, text: "Scorecard project decide on pipeline approach with Robert, Kris, Kent for Leadershiph team L10", completed: "12/01/2025", owner: "Scott Levy" },
      { id: 55, text: "@Kent to reach out to ?DMD re: damage control and relationships #next", completed: "12/01/2025", owner: "Kent Taggert" }
    ]
  },
  {
    week: "Week 48 2025 - November 24",
    items: [
      { id: 56, text: "Pipe Drive: automations broken", completed: "11/25/2025", owner: "Jeff Bell", isResolved: true },
      { id: 57, text: "Get updated pipe CRM by next week @kmroesken #next", completed: "11/25/2025", owner: "Kris Roeskin" },
      { id: 58, text: "[Jeff] Create Q4 Rock for PI using considerations in notes below #next", completed: "11/25/2025", owner: "Jeff Bell" },
      { id: 59, text: "@Jeffwithmender clarify with Dbox the list that this person was on to see if there any issues #next", completed: "11/25/2025", owner: "Jeff Bell" },
      { id: 60, text: "@Jeffwithmender to check in with Denise on the CBRE asks to verify it's done #next", completed: "11/25/2025", owner: "Jeff Bell" },
      { id: 61, text: "Update measurable ownership/clarify naming", completed: "11/25/2025", owner: "Scott Levy", isResolved: true },
      { id: 62, text: "Scott update the items still unassigned by EOD 11/20", completed: "11/25/2025", owner: "Scott Levy", isResolved: true },
      { id: 63, text: "Import from Bloom or from Spreadsheet", completed: "11/25/2025", owner: "Scott Levy", isResolved: true },
      { id: 64, text: "Scott and team will move all of the Roberts org L10s and issues and todos over", completed: "11/25/2025", owner: "Scott Levy" },
      { id: 65, text: "CBRE - GRMS Business Continuity Management (BCM) Questionaire", completed: "11/25/2025", owner: "Robert Erwin", isResolved: true },
      { id: 66, text: "@dbox to call CDR Global contact re: wire fraud issue for damage control #next", completed: "11/25/2025", owner: "David Box" },
      { id: 67, text: "@dbox sending lee finalized forecast for November BY REVENUE LINE should include brokerage #next", completed: "11/25/2025", owner: "David Box" },
      { id: 68, text: "L10s moved", completed: "11/24/2025", owner: "Scott Levy", isResolved: true },
      { id: 69, text: "AI Policy/Sign Off Quick Discussion", completed: "11/24/2025", owner: "Scott Levy", isResolved: true },
      { id: 70, text: "Scott /RM team import remaining critical cutover data from Bloom", completed: "11/24/2025", owner: "Scott Levy" },
      { id: 71, text: "Scott add to LT 1:1s Source of truth on financials data", completed: "11/24/2025", owner: "Scott Levy", isResolved: true },
      { id: 72, text: "Scott to get template over to Robert to socialize if helpful for CDW", completed: "11/24/2025", owner: "Scott Levy" },
      { id: 73, text: "[Kent] BG Update from QP #next", completed: "11/24/2025", owner: "Kent Taggert" }
    ]
  },
  {
    week: "Week 47 2025 - November 17",
    items: [
      { id: 74, text: "[Kent] Create Hedgehog for Flywheel #next", completed: "11/23/2025", owner: "Kent Taggert" },
      { id: 75, text: "December project meeting @Kent to produce our forecast and targets #next", completed: "11/23/2025", owner: "Kent Taggert" },
      { id: 76, text: "CDW / US Bank - Budgetary Pricing Template - @RobertE to get a meeting set up to review this and bring everyone up to speed", completed: "11/21/2025", owner: "Robert Erwin", isResolved: true },
      { id: 77, text: "@RobertE will email his team to connect with Scott #next", completed: "11/21/2025", owner: "Robert Erwin" },
      { id: 78, text: "@RobertE send client profitability to Lee from Power BI #next", completed: "11/20/2025", owner: "Robert Erwin" },
      { id: 79, text: "Monthly Financials review", completed: "11/20/2025", owner: "Scott Levy", isResolved: true },
      { id: 80, text: "Juice v. Squeeze on CDW/ Discussion", completed: "11/20/2025", owner: "Scott Levy", isResolved: true },
      { id: 81, text: "Bloom to ResultMaps transition... moving all of our existing meetings over / setup", completed: "11/20/2025", owner: "Kris Roeskin", isResolved: true },
      { id: 82, text: "PLEASE REMOVE", completed: "11/20/2025", owner: "Jeff Bell", isResolved: true },
      { id: 83, text: "@kmroesken meet with Robert and Kent regarding CDW/US Bank #next", completed: "11/20/2025", owner: "Kris Roeskin" },
      { id: 84, text: "US Bank RFI - questions, concerns, alignment to core competencies, resources needed, roles and responsibilities", completed: "11/20/2025", owner: "Kris Roeskin", isResolved: true },
      { id: 85, text: "Per Kent Focal - Wire issue - how can we prevent it, what process should be in place", completed: "11/20/2025", owner: "Kent Taggert", isResolved: true },
      { id: 86, text: "Scorecard forecasts in the spreadsheet", completed: "11/20/2025", owner: "Scott Levy", isResolved: true },
      { id: 87, text: "Discuss where we are per kent as we move through", completed: "11/20/2025", owner: "Robert Erwin", isResolved: true },
      { id: 88, text: "What should Kent communicate regarding the wirefraud", completed: "11/20/2025", owner: "Scott Levy", isResolved: true },
      { id: 89, text: "Integration Assessment Delivered to Kent", completed: "11/19/2025", owner: "Scott Levy" },
      { id: 90, text: "Kent onboarded", completed: "11/18/2025", owner: "Scott Levy" },
      { id: 91, text: "@Jeffwithmender to get with Robert, John and Maha to understand why pipedrive automations are breaking #next", completed: "11/18/2025", owner: "Jeff Bell" },
      { id: 92, text: "[Jeff] Follow-up w/ Robert on PO in Razor and Master Items concerns #next", completed: "11/17/2025", owner: "Jeff Bell" },
      { id: 93, text: "[Jeff] Create Tracking System for Maha #next", completed: "11/17/2025", owner: "Jeff Bell" }
    ]
  },
  {
    week: "Week 46 2025 - November 10",
    items: [
      { id: 94, text: "@RobertE get team to send Brokerage revenue to Denise per Lee (Dbox has sent his bit) #next", completed: "11/14/2025", owner: "Robert Erwin" },
      { id: 95, text: "Need full description - Rec to FG ?", completed: "11/14/2025", owner: "Scott Levy", isResolved: true },
      { id: 96, text: "RM Quick Demo - Command Center, L10s, 1:1s, Projects", completed: "11/14/2025", owner: "Scott Levy", isResolved: true },
      { id: 97, text: "[Jeff] Set meeting with Lee to review transactions for two instances with Justn and Gus #next", completed: "11/14/2025", owner: "Jeff Bell" },
      { id: 98, text: "[Jeff] Identify at least one Inbound Sales Candidate and intro Kris #next", completed: "11/14/2025", owner: "Jeff Bell" },
      { id: 99, text: "[Kris] Structure and add Deal Desk Call #next", completed: "11/14/2025", owner: "Kris Roeskin" },
      { id: 100, text: "I have about 1/2 of the metrics completed in charts, I need to complete the balance.", completed: "11/14/2025", owner: "David Box", isResolved: true },
      { id: 101, text: "Automation emails that are to be going to product sales are not working. We will need to review why they stopped and correct.", completed: "11/13/2025", owner: "Jeff Bell", isResolved: true },
      { id: 102, text: "Kris Onboarded", completed: "11/13/2025", owner: "Scott Levy" },
      { id: 103, text: "[Jeff] Schedule Town Hall #next", completed: "11/12/2025", owner: "Jeff Bell" },
      { id: 104, text: "DBox onboarded", completed: "11/12/2025", owner: "Scott Levy" },
      { id: 105, text: "Jeff onboarded", completed: "11/12/2025", owner: "Scott Levy" },
      { id: 106, text: "Robert Onboarded", completed: "11/11/2025", owner: "Scott Levy" },
      { id: 107, text: "@brianc N8N Integration with Servicenow - discuss with Scott", completed: "11/11/2025", owner: "Brian Childers" },
      { id: 108, text: "Brian onboarded", completed: "11/11/2025", owner: "Scott Levy" },
      { id: 109, text: "[Robert] Intro Chris Rey to Kris Retry", completed: "11/10/2025", owner: "Robert Erwin" },
      { id: 110, text: "[Robert] Robert has been reviewing impacts on client performance that he will share with Lee and DBox", completed: "11/10/2025", owner: "Robert Erwin" },
      { id: 111, text: "[Robert] Robert and Kris to fill the seats for both events. Due to Kent by 10-31", completed: "11/10/2025", owner: "Robert Erwin" },
      { id: 112, text: "[Robert] DBox & Robert to provide list to Denice of brokerage deals. We need to go back to 2024", completed: "11/10/2025", owner: "Robert Erwin" },
      { id: 113, text: "[Lee] Send Financial Package to Kuefler for QP3", completed: "11/10/2025", owner: "Lee Nester" }
    ]
  }
];

export default function LeadershipTodos() {
  const [filterResolved, setFilterResolved] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState(todosData.map(w => w.week));

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const totalTodos = todosData.reduce((acc, week) => acc + week.items.length, 0);
  const totalResolved = todosData.reduce((acc, week) => acc + week.items.filter(i => i.isResolved).length, 0);

  const filteredData = filterResolved 
    ? todosData.map(week => ({
        ...week,
        items: week.items.filter(item => item.isResolved)
      })).filter(week => week.items.length > 0)
    : todosData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Leadership Team To-Do's Completed</h1>
        <p className="text-gray-600 mb-4">Weeks 46-52, 2025 (November 10 - December 22)</p>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-6">
              <div>
                <span className="text-3xl font-bold text-gray-800">{totalTodos}</span>
                <span className="text-gray-500 ml-2">Total Completed</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-amber-600">{totalResolved}</span>
                <span className="text-gray-500 ml-2">Were Resolved Issues</span>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filterResolved}
                onChange={(e) => setFilterResolved(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="text-sm text-gray-600">Show only resolved issues</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {filteredData.map((weekData) => (
            <div key={weekData.week} className="bg-white rounded-lg shadow overflow-hidden">
              <button
                onClick={() => toggleWeek(weekData.week)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800">{weekData.week}</span>
                  <span className="text-sm text-gray-500">
                    ({weekData.items.length} items
                    {weekData.items.filter(i => i.isResolved).length > 0 && 
                      `, ${weekData.items.filter(i => i.isResolved).length} resolved issues`
                    })
                  </span>
                </div>
                <span className="text-gray-400">
                  {expandedWeeks.includes(weekData.week) ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedWeeks.includes(weekData.week) && (
                <div className="divide-y divide-gray-100">
                  {weekData.items.map((item) => (
                    <div key={item.id} className="px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <span className="text-gray-400 text-sm mt-0.5">{item.id}.</span>
                        <div className="flex-1">
                          <div className="flex items-start gap-2 flex-wrap">
                            <span className="text-gray-800">{item.text}</span>
                            {item.isResolved && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap">
                                Resolved Issue
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <span className="font-medium">{item.owner}</span>
                            <span className="mx-2">•</span>
                            <span>{item.completed}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
