// Original intermediate-level usage situations. One stable concept ID yields eight
// distinct recognition/interpretation tasks; variations share a concept, not a new fact.
// Version v1 IDs and row order are immutable: changing either alters canonical options
// on an unfinished round. Add new concepts only with a new bank version/migration.
const ROWS = `
work|follow up|The client has not replied to yesterday's proposal; send a polite message asking if they have questions.|contact someone again after an earlier exchange
work|meet a deadline|The report is due Friday, so the team rearranges its schedule to submit it on time.|finish work by the agreed date
work|raise a concern|A colleague notices a possible safety problem and tells the manager before anyone gets hurt.|bring a worry to someone's attention
work|reach an agreement|After discussing the price and delivery date, both sides accept the same terms.|settle on terms everyone accepts
work|take responsibility|The shipment was sent to the wrong address; Noor admits the mistake and arranges a correction.|accept ownership of a task or mistake
work|keep someone updated|The repair will take longer than expected; the technician sends the customer a brief progress message.|continue giving someone current information
work|set priorities|With three urgent requests arriving at once, the team decides which matters most.|decide what should be done first
work|make a decision|The manager compares the two proposals and finally chooses the less expensive option.|choose between available options
work|address an issue|Several customers cannot log in; the support team investigates and fixes the problem.|deal directly with a problem
work|request clarification|The instructions say 'soon' but give no date, so Rina asks when the work is actually due.|ask for an unclear point to be explained
work|provide feedback|After reading the draft, a colleague describes what works and suggests two improvements.|give a response about someone's work
work|make an adjustment|The first schedule conflicts with the school holiday, so the organiser changes the date.|change something slightly to make it work better
work|manage expectations|Delivery may take a week, so the seller states that clearly rather than promising tomorrow.|help others form a realistic idea of what will happen
work|reach out|A former classmate works in the field; Mina sends them a message to ask about entry-level roles.|contact someone to start a conversation
work|take into account|Before choosing the venue, the organiser considers accessibility and travel time.|consider a relevant factor when deciding
work|work out a solution|The original plan will not fit the budget, so the group develops another workable approach.|find a practical answer to a problem
work|stick to the plan|The team agreed on a route; despite minor distractions, they continue with that route.|continue following an agreed course of action
work|share the workload|One person cannot finish all the boxes, so four coworkers divide the packing.|divide tasks among several people
work|ask for input|Before changing the website, Sam invites the support team to offer their ideas.|request another person's ideas or opinion
work|run into a problem|During setup, the printer stops connecting and delays the morning shift.|encounter a difficulty unexpectedly
work|look into it|A customer reports an incorrect charge; the clerk promises to check the records.|investigate a question or complaint
work|come up with an idea|The usual poster is not attracting visitors, so a student suggests a short demonstration.|think of a new possibility
work|put together a proposal|The team collects costs, dates and sketches into a document for the director.|assemble a plan for consideration
work|carry out a task|After the manager approves the checklist, the crew completes each step.|perform an assigned piece of work
work|hand over a project|On her last day, Aisha gives the new coordinator the files and explains what remains.|transfer responsibility to someone else
school|pay attention|The teacher explains a new method; the students listen closely instead of chatting.|listen or watch carefully
school|take notes|During the guest lecture, Rafi writes down the main points for later revision.|write brief records of important information
school|hand in an assignment|The essay is finished, so Mei submits it to the teacher before the due date.|submit completed schoolwork
school|catch up|After missing two classes, Salma studies the notes to reach the same point as her classmates.|recover progress after falling behind
school|figure out|The graph seems confusing at first; after trying two examples, the students understand it.|understand something through thought or effort
school|check your work|Before submitting the calculation, Tariq reads it again to find mistakes.|review a completed task for errors
school|draw a conclusion|After comparing the survey results, the class states what the evidence suggests.|form a judgment from evidence
school|make a point|During the discussion, Nila explains one reason why the plan might fail.|express an argument or observation
school|back up a claim|The speaker mentions a source and shows figures to support the statement.|provide evidence for an assertion
school|look up a word|The passage contains an unfamiliar term, so Irfan checks its meaning in a dictionary.|search for the meaning of a word
school|keep track of progress|A student records each practice score to see whether the method is helping.|monitor how something develops over time
school|break down a problem|The equation looks too large, so the group solves its smaller parts one by one.|divide a complex problem into manageable parts
school|work through an example|Before tackling the exercise alone, the class follows a complete sample step by step.|study a sample carefully from start to finish
school|revise a draft|After receiving comments, a student rewrites the introduction and improves the conclusion.|change an early version of a piece of writing
school|compare and contrast|The question asks how two stories are alike and how they differ.|examine similarities and differences
school|take part in a discussion|Rather than remaining silent, Eva offers an idea and listens to the others.|participate in a conversation about a topic
school|ask a follow-up question|After the explanation, a learner asks for an example of the final step.|ask another question to learn more
school|put an idea into words|A learner understands the diagram but struggles to explain it aloud.|express a thought clearly in language
school|see the bigger picture|The class studies how several separate events are connected across decades.|understand the wider context of individual details
school|make a connection|A reader notices that today's lesson relates to a topic from last term.|recognise a link between ideas
school|test an assumption|Before trusting the result, the group checks whether their initial belief was true.|check whether an unproved belief holds
school|give an example|The explanation feels abstract, so the teacher describes a real situation.|illustrate an idea with a particular case
school|stay on topic|The discussion drifts to films; the chair brings it back to the assigned reading.|keep talking about the intended subject
school|sum up|At the end of the presentation, Farah states the three key findings briefly.|state the main ideas briefly
school|meet the requirements|The essay includes the sources, length and sections specified in the instructions.|satisfy the stated conditions
travel|miss a connection|The first bus is late, and the traveller arrives after the next train has left.|fail to catch a planned onward service
travel|change plans|Rain closes the walking trail, so the group chooses a museum instead.|choose a different course of action
travel|make a reservation|The hotel may be full, so the family books a room ahead of time.|arrange a place in advance
travel|check in|At the hotel desk, the guest confirms a reservation and receives a room key.|register arrival for a booked journey or stay
travel|find your way|Without a guide, the visitors use signs to reach the correct platform.|navigate to the intended destination
travel|ask for directions|The address is unfamiliar, so Omar asks a passerby which street to take.|request guidance about a route
travel|allow extra time|The road can be busy, so the family leaves early enough for possible delays.|plan additional time for uncertainty
travel|take a detour|The bridge is closed, so the driver uses a longer road around it.|use an alternative route around an obstacle
travel|keep an eye on|While waiting for the train, Anika watches the departure board for changes.|watch something for updates or trouble
travel|travel light|For a two-day trip, Farhan packs only what he can carry in a small bag.|bring little luggage on a journey
travel|make the most of|With only one afternoon in the city, the visitors plan carefully to enjoy it fully.|use an opportunity as well as possible
travel|stick to a budget|The group agrees to spend no more than a set amount on meals and transport.|avoid spending more than planned
travel|check the schedule|Before leaving home, the traveller confirms when the last bus departs.|verify planned departure or arrival times
travel|get around|The town has frequent buses, making it easy to move between neighbourhoods.|move from place to place locally
travel|stop by|On the way to the station, Mina visits a friend briefly.|visit a place or person for a short time
travel|set off|At sunrise, the group leaves home and begins the long journey.|begin a journey
travel|arrive on time|Despite traffic, the family reaches the terminal before departure.|reach a place at the expected time
travel|lose your bearings|After several turns in an unfamiliar area, the visitors no longer know where they are.|become unsure of your location or direction
travel|plan ahead|Because seats fill quickly, the student buys a ticket a week before travelling.|prepare in advance rather than at the last minute
travel|take a break|After hours on the road, the driver stops to rest and drink water.|pause an activity for rest
travel|make your way back|After the concert, the friends return slowly to the bus stop.|go back towards a previous place
travel|ask around|No one at the desk knows the answer, so the traveller asks several other people.|ask multiple people for information
travel|run out of time|The museum closes at five, and the visitors cannot see the final gallery.|have no time left to complete something
travel|keep in touch|After moving abroad, the friends continue calling each other every month.|maintain contact despite distance
travel|pick someone up|After the late flight, Asif drives to the airport to collect his sister.|collect someone by vehicle
home|sort things out|Two roommates disagree about cleaning and sit down to settle the arrangement.|resolve a practical disagreement or confusion
home|lend a hand|The neighbour has too many bags, so Shila offers to carry two upstairs.|help someone with a task
home|put off a chore|The floor needs cleaning, but Ali delays the job until the weekend.|postpone a household task
home|make time for|Despite a busy week, the family protects one evening to eat together.|reserve time for something important
home|check in with someone|A friend has been quiet lately, so Sam sends a message to ask how they are.|contact someone to see how they are doing
home|clear up a misunderstanding|Two friends realise they meant different dates and explain what happened.|resolve confusion about what someone meant
home|make a compromise|One roommate wants music and another needs quiet; they agree on a limited hour.|reach a middle ground by giving up part of each preference
home|bring up a topic|During dinner, Tara starts a conversation about sharing the bills.|introduce a subject for discussion
home|set a boundary|When a friend calls during study hours, Lila explains when she can talk instead.|state a reasonable limit on what you can accept
home|take turns|Two siblings both want the computer, so each uses it for thirty minutes.|do something one after the other
home|keep a promise|Rana said he would water the plants and does it before leaving.|do what you said you would do
home|make room|A guest is arriving, so the family moves a table to create more space.|create space for someone or something
home|pitch in|Everyone helps prepare dinner instead of leaving all the work to one person.|contribute to a shared task
home|work something out|Two friends cannot meet Saturday, so they find a time that suits both.|find a workable arrangement
home|look after someone|While the parents are away, an aunt cares for the younger children.|take care of another person
home|tidy up|Before the guests arrive, the children put the scattered toys away.|make a place neat
home|come to terms with|After the move, a student gradually accepts that the old neighbourhood is far away.|gradually accept a difficult reality
home|give someone space|A friend is upset and asks for a little time alone before talking.|allow someone time or privacy
home|speak up|Nobody has noticed the broken step, so Mina tells the group about the danger.|say something openly instead of staying silent
home|make a good impression|At the first meeting, Saira listens carefully and arrives prepared.|create a favourable first opinion
home|keep an open mind|The proposed dish is unfamiliar, but Amir agrees to taste it before judging.|consider something without rejecting it immediately
home|take care of|Before going away, Liza checks that the plants have water.|attend to a need or responsibility
home|settle in|After moving, the family unpacks and begins to feel comfortable in the new place.|become comfortable in a new place
home|hear someone out|Although he disagrees, Rahul listens until his friend has finished explaining.|listen to a person's full explanation
home|get used to|At first the earlier bus feels strange, but after a month it seems normal.|become familiar with a change
community|spread the word|The clinic changes its hours, and volunteers tell neighbours about the new schedule.|tell many people about information
community|raise awareness|A group explains why clean water matters through posters and a school talk.|help people understand an issue
community|take action|After noticing litter by the river, residents organise a cleanup.|do something practical about a problem
community|work together|Neighbours share tools and time to repair the common garden.|cooperate towards a shared goal
community|make a difference|One volunteer teaches reading every week and several learners improve.|have a positive effect
community|show support|Friends attend the fundraiser and encourage the people organising it.|express encouragement or practical help
community|speak out|Residents publicly explain why the unsafe crossing needs repair.|state an opinion openly about a problem
community|follow through|The committee promised to fix the tap and completes the repair next week.|finish what you promised or started
community|take the lead|When nobody is organising the event, Priya volunteers to coordinate it.|accept primary responsibility for directing a task
community|bring people together|The neighbourhood meal gives families a chance to meet one another.|create an opportunity for people to connect
community|build trust|The new volunteer keeps every appointment and explains decisions honestly.|develop confidence in someone's reliability
community|listen to concerns|Before changing the park, planners hear residents' worries about safety.|pay attention to people's worries
community|make an effort|Although learning the route is difficult, the volunteer tries again each week.|try deliberately to do something
community|give back|After receiving help as a child, Hasan volunteers at the same library.|help a community that has helped you
community|set an example|The older students put their rubbish in bins and younger pupils copy them.|show others a good way to behave
community|keep things running|When the coordinator is ill, others manage the centre's daily activities.|maintain the operation of a service
community|look out for|During the heat wave, neighbours check that older residents have water.|watch over someone's wellbeing
community|step in|The regular organiser is absent, so Maya temporarily leads the meeting.|take someone's place when help is needed
community|come together|After the storm, residents gather and help clear the street.|unite for a shared purpose
community|get involved|Instead of only watching, a student joins the neighbourhood clean-up.|participate actively
community|make a contribution|A local baker brings fresh bread for the community meal, helping the volunteers serve everyone.|provide something helpful to a joint effort
community|reach a wider audience|The library shares its reading event online so more people hear about it.|communicate with more people
community|make your voice heard|At the public meeting, residents explain what they want changed.|ensure your opinion is considered
community|take part|A new resident joins the community gardening day and helps neighbours prepare the soil.|participate in an event
community|keep someone informed|The organisers send volunteers any changes to the start time.|continue telling someone relevant updates
`.trim().split('\n').map(line => {
  const [topic, phrase, scene, meaning] = line.trim().split('|');
  return { topic, phrase, scene, meaning, id: phrase.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
});

// Two different tasks (select an expression / interpret it) in four communicative
// settings. Every task has a stable ID and canonical answer/options for reloads.
const SETTINGS = [
  ['A friend asks for advice', 'Which expression would you use to describe this situation?', 'What does the expression mean here?'],
  ['You explain this to a classmate', 'Which phrase captures the action most precisely?', 'Which interpretation best fits the context?'],
  ['You write a short update', 'Which natural expression sums up the situation?', 'How would you explain the expression in plain English?'],
  ['You discuss what happened', 'Which expression describes the key action?', 'Which reading is supported by the details?']
];
export const USAGE_CONCEPTS = ROWS;
export const USAGE_ROUNDS = ROWS.flatMap((item, index) => {
  const peers = ROWS.filter(other => other.topic === item.topic && other.id !== item.id);
  return SETTINGS.flatMap(([setting, choose, interpret], settingIndex) => {
    const distractors = [1, 7, 13].map(offset => peers[(index * 3 + settingIndex * 5 + offset) % peers.length]);
    return [
      { id: `usage-v1-${item.id}-${settingIndex}-phrase`, type: 'usage', conceptId: item.id, label: 'CHOOSE AN EXPRESSION', scene: setting, sentence: item.scene, prompt: choose, options: [item.phrase, ...distractors.map(row => row.phrase)], answer: item.phrase, explanation: `${item.phrase} means ${item.meaning}. By contrast, ${distractors[0].phrase} means ${distractors[0].meaning}.` },
      { id: `usage-v1-${item.id}-${settingIndex}-meaning`, type: 'usage', conceptId: item.id, label: 'READ THE MEANING', scene: setting, sentence: `${item.scene} The speaker calls this “${item.phrase}.”`, prompt: interpret, options: [item.meaning, ...distractors.map(row => row.meaning)], answer: item.meaning, explanation: `Here, ${item.phrase} means ${item.meaning}. By contrast, ${distractors[0].phrase} means ${distractors[0].meaning}.` }
    ];
  });
});
