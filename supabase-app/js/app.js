import { ACADEMY_CONTENT } from './academy-data.js';
import { USAGE_CONCEPTS, USAGE_ROUNDS } from './usage-data.js';

    // Keep implementation details and the vocabulary corpus out of the global namespace.
    // This is defense-in-depth only: browser-side code/data remain inspectable and user-owned.
    (function wordtrailApp() {
    'use strict';

    const ENVIRONMENTS = [
      { id: 'campus', name: 'Campus', icon: '🎒', color: '#e8f0dc', short: 'Classes, labs & curious questions', description: 'Find precise words for lessons, ideas, and campus conversations.' },
      { id: 'market', name: 'City market', icon: '🧺', color: '#faeadc', short: 'Shops, streets & small discoveries', description: 'Practice the language of shopping, bargaining, and busy city life.' },
      { id: 'workplace', name: 'Workplace', icon: '🗂️', color: '#e2edf2', short: 'Teams, projects & clear communication', description: 'Choose words that help you sound clear, calm, and professional.' },
      { id: 'home', name: 'Home & friends', icon: '🪴', color: '#f5e7ed', short: 'Everyday moments & warm conversations', description: 'Build expressive vocabulary for the familiar moments of daily life.' },
      { id: 'travel', name: 'On the move', icon: '🧭', color: '#eee8d9', short: 'Journeys, detours & new places', description: 'Make sense of the words you need while traveling and exploring.' }
    ];

    const QUESTIONS = [
      { id: 'curious', env: 'campus', scene: 'A science demonstration', sentence: 'During the science demo, Jo was ____ about why the liquid changed color and asked three questions.', hint: 'Look for a word that describes wanting to know more.', options: ['curious', 'careless', 'exhausted', 'ordinary'], answer: 'curious', definition: 'Curious means eager to learn or know about something.', nuance: 'Inquisitive is a close relative and often suggests asking many questions. Interested is broader: you can be interested without actively investigating.', example: 'The curious student stayed after class to examine the model.', family: 'Wanting to know' },
      { id: 'concise', env: 'campus', scene: 'A study group', sentence: 'The tutor asked for a ____ summary: just the main point in two sentences.', hint: 'The tutor wants it brief, but still clear.', options: ['concise', 'vague', 'elaborate', 'casual'], answer: 'concise', definition: 'Concise means short and clear, using no more words than needed.', nuance: 'Brief means short in length. Concise adds the idea of being clear and economical; a short answer can still be vague.', example: 'Her concise notes made revision much easier.', family: 'Brief & clear' },
      { id: 'puzzled', env: 'campus', scene: 'Reading a tricky direction', sentence: 'Mina looked ____ when the directions seemed to contradict each other.', hint: 'She is unsure because something does not make sense.', options: ['puzzled', 'confident', 'relieved', 'generous'], answer: 'puzzled', definition: 'Puzzled means confused or unsure because something is difficult to understand.', nuance: 'Confused is more general. Puzzled often suggests there is a specific question or mystery to work out.', example: 'He was puzzled by the final step in the instructions.', family: 'Confused & curious' },
      { id: 'accurate', env: 'campus', scene: 'Finishing a lab report', sentence: 'Before submitting the lab report, check that every measurement is ____.', hint: 'The numbers need to match the facts exactly.', options: ['accurate', 'vivid', 'brief', 'polite'], answer: 'accurate', definition: 'Accurate means correct and close to the true value or facts.', nuance: 'Precise means exact and carefully defined. A measurement can be precise in detail; accurate means it is actually correct.', example: 'The map is accurate enough to find the trailhead.', family: 'Correct & exact' },
      { id: 'inspect', env: 'market', scene: 'Choosing a mango', sentence: 'She turned the mango in her hand to ____ its skin for bruises.', hint: 'She is checking it carefully, not just looking briefly.', options: ['inspect', 'announce', 'borrow', 'ignore'], answer: 'inspect', definition: 'Inspect means to look at something carefully, often to check its condition or details.', nuance: 'Examine is a close synonym. Glance means to look very quickly, so it would not fit a careful check.', example: 'The mechanic inspected the bicycle before the trip.', family: 'Looking carefully' },
      { id: 'bustling', env: 'market', scene: 'A lunch-hour café', sentence: 'The café was so ____ at lunchtime that we could barely hear each other.', hint: 'It was full of activity, movement, and noise.', options: ['bustling', 'deserted', 'silent', 'fragile'], answer: 'bustling', definition: 'Bustling describes a place full of energetic activity and people.', nuance: 'Busy is more general. Bustling usually gives a lively, crowded impression; it does not simply mean noisy.', example: 'The bustling station was full of commuters.', family: 'Busy & lively' },
      { id: 'reasonable', env: 'market', scene: 'Paying for a repair', sentence: 'The tailor charged a ____ price: fair, and not higher than expected.', hint: 'The amount feels fair and sensible.', options: ['reasonable', 'reckless', 'distant', 'bitter'], answer: 'reasonable', definition: 'Reasonable means fair, sensible, or not excessive in the situation.', nuance: 'Affordable means you can pay for it. Reasonable means the price seems fair, even if it is not the cheapest.', example: 'We found a reasonable room near the station.', family: 'Fair & sensible' },
      { id: 'ripe', env: 'market', scene: 'Picking fresh fruit', sentence: 'The mango is soft and fragrant, so it is probably ____.', hint: 'It is ready to eat, not raw or overripe.', options: ['ripe', 'stale', 'hollow', 'narrow'], answer: 'ripe', definition: 'Ripe describes fruit that has developed enough to be ready to eat.', nuance: 'Mature can describe something fully developed, but ripe is the everyday word for ready-to-eat fruit.', example: 'Choose a ripe peach that gives slightly when pressed.', family: 'Food & freshness' },
      { id: 'composed', env: 'workplace', scene: 'A difficult client call', sentence: 'Even when the client complained, Arun stayed ____ and answered calmly.', hint: 'He kept control of his feelings instead of panicking.', options: ['composed', 'frantic', 'blunt', 'careless'], answer: 'composed', definition: 'Composed means calm and in control, especially in a stressful moment.', nuance: 'Calm is the broad everyday word. Composed suggests someone is managing their reactions and not showing panic.', example: 'She remained composed while presenting to the board.', family: 'Calm & steady' },
      { id: 'practical', env: 'workplace', scene: 'Planning a small pilot', sentence: 'The team chose a ____ solution they could test this week with their current budget.', hint: 'The plan is useful and realistic, not just exciting in theory.', options: ['practical', 'imaginary', 'delicate', 'distant'], answer: 'practical', definition: 'Practical describes an idea or plan that is useful and possible to carry out.', nuance: 'Feasible means it can be done. Practical often adds that it is useful in real conditions.', example: 'A practical checklist helped the team avoid missed steps.', family: 'Useful & realistic' },
      { id: 'diplomatic', env: 'workplace', scene: 'Disagreeing in a meeting', sentence: 'She chose a ____ reply that expressed disagreement without embarrassing her colleague.', hint: 'She handled a sensitive situation with tact.', options: ['diplomatic', 'reckless', 'harsh', 'vague'], answer: 'diplomatic', definition: 'Diplomatic means tactful and careful with other people’s feelings, especially during disagreement.', nuance: 'Tactful is a close synonym. Diplomatic often suggests carefully balancing different people or interests.', example: 'He gave a diplomatic answer to a difficult question.', family: 'Tact & tone' },
      { id: 'reliable', env: 'workplace', scene: 'Choosing a supplier', sentence: 'We need a ____ supplier who delivers on the promised date every time.', hint: 'The team needs someone they can depend on.', options: ['reliable', 'temporary', 'vivid', 'nervous'], answer: 'reliable', definition: 'Reliable means dependable and likely to do what is expected.', nuance: 'Trustworthy is often about honesty. Reliable is often about consistently doing what you promised.', example: 'A reliable teammate lets the whole group plan ahead.', family: 'Trust & dependability' },
      { id: 'cozy', env: 'home', scene: 'A quiet reading corner', sentence: 'The blanket, warm light, and soft music made the reading corner feel ____.', hint: 'The space feels warm, comfortable, and inviting.', options: ['cozy', 'crowded', 'sharp', 'formal'], answer: 'cozy', definition: 'Cozy means pleasantly warm, comfortable, and snug.', nuance: 'Comfortable is broader. Cozy often suggests a small, warm, welcoming place or feeling.', example: 'We spent the rainy evening in a cozy little café.', family: 'Comfort & warmth' },
      { id: 'frugal', env: 'home', scene: 'Making a household budget', sentence: 'By cooking at home and repairing old things, he lived a ____ lifestyle.', hint: 'He spends carefully and avoids unnecessary costs.', options: ['frugal', 'extravagant', 'hurried', 'noisy'], answer: 'frugal', definition: 'Frugal means careful about spending money or using resources.', nuance: 'Thrifty is a friendly close synonym. Cheap can sound negative and may describe poor quality, not careful spending.', example: 'A frugal shopper compares prices before buying.', family: 'Saving & spending' },
      { id: 'murmured', env: 'home', scene: 'Someone is asleep nearby', sentence: 'Not wanting to wake anyone, she ____ the answer under her breath.', hint: 'She spoke softly and quietly.', options: ['murmured', 'announced', 'shouted', 'declared'], answer: 'murmured', definition: 'Murmured means spoke in a low, soft voice.', nuance: 'Whispered is even quieter and usually made without using the full voice. Muttered can sound annoyed or unclear.', example: '“I think it’s in the drawer,” he murmured.', family: 'Ways of speaking' },
      { id: 'sturdy', env: 'home', scene: 'Setting up a small table', sentence: 'The table did not wobble under the books; it was surprisingly ____.', hint: 'It is strong and solid, not flimsy.', options: ['sturdy', 'flimsy', 'fancy', 'hollow'], answer: 'sturdy', definition: 'Sturdy means strong and solid enough to last or support weight.', nuance: 'Durable emphasizes lasting over time. Sturdy emphasizes physical strength and stability.', example: 'The sturdy chair held up well through years of use.', family: 'Strength & build' },
      { id: 'detour', env: 'travel', scene: 'A bridge is closed', sentence: 'With the main bridge closed, the driver took a ____ through nearby streets.', hint: 'The usual route is blocked, so the driver goes another way.', options: ['detour', 'destination', 'border', 'platform'], answer: 'detour', definition: 'A detour is a route taken to avoid a closed or blocked road, or to go around something.', nuance: 'An alternative route is any different route. A detour is often temporary or less direct because the usual way is unavailable.', example: 'Roadworks forced us to take a detour through the village.', family: 'Routes & journeys' },
      { id: 'frequent', env: 'travel', scene: 'A local bus route', sentence: 'The bus makes ____ stops, so the journey takes longer than the express service.', hint: 'There are many stops, happening again and again.', options: ['frequent', 'rare', 'private', 'narrow'], answer: 'frequent', definition: 'Frequent means happening or appearing often.', nuance: 'Regular means happening at predictable intervals. Frequent focuses on how often something happens.', example: 'Frequent breaks helped everyone stay focused.', family: 'How often' },
      { id: 'hospitable', env: 'travel', scene: 'Staying with a local family', sentence: 'The family welcomed us with a meal and a comfortable place to stay; they were ____.', hint: 'They made their guests feel welcome.', options: ['hospitable', 'impatient', 'severe', 'distant'], answer: 'hospitable', definition: 'Hospitable describes someone who is welcoming and generous to guests.', nuance: 'Friendly describes a warm manner generally. Hospitable specifically describes welcoming visitors or guests.', example: 'Our hosts were hospitable and made us feel at home.', family: 'Welcoming & kind' },
      { id: 'serene', env: 'travel', scene: 'A lake at sunrise', sentence: 'The lake was still and peaceful at sunrise; the whole scene felt ____.', hint: 'The scene feels quiet and untroubled.', options: ['serene', 'hectic', 'harsh', 'cramped'], answer: 'serene', definition: 'Serene means calm, peaceful, and undisturbed.', nuance: 'Quiet describes low sound. Serene describes a peaceful quality or atmosphere, which can be quiet but is not only about sound.', example: 'The garden felt serene after the rain.', family: 'Calm places' },
      { id: 'helpful', env: 'campus', scene: 'Finding a book', sentence: 'The librarian was ____ and walked us to the shelf with the book we needed.', hint: 'They made it easier for us to get the help we needed.', options: ['helpful', 'careless', 'distant', 'sleepy'], answer: 'helpful', definition: 'Helpful means willing to help, or making a task easier.', nuance: 'Useful describes something that helps you do a task; helpful often describes a person, action, or piece of information.', example: 'The helpful classmate showed me where to submit the form.', family: 'Everyday people & actions', band: 'Everyday' },
      { id: 'clear', env: 'campus', scene: 'Explaining a science rule', sentence: 'After the teacher gave an example, the instructions were ____ and everyone understood them.', hint: 'The meaning was easy to understand.', options: ['clear', 'crowded', 'fragile', 'urgent'], answer: 'clear', definition: 'Clear means easy to understand or see, with little confusion.', nuance: 'Understandable is a close synonym. Brief only means short; a brief explanation can still be unclear.', example: 'Please give a clear example of how to solve it.', family: 'Easy to understand', band: 'Everyday' },
      { id: 'difficult', env: 'campus', scene: 'A final exam question', sentence: 'The final question was ____; it took me ten minutes to work it out.', hint: 'It was not easy to do.', options: ['difficult', 'simple', 'nearby', 'polite'], answer: 'difficult', definition: 'Difficult means not easy to do, understand, or deal with.', nuance: 'Hard is the common everyday synonym. Challenging can sound more positive, as if the task is demanding but worthwhile.', example: 'The last part of the puzzle was difficult.', family: 'Difficulty & effort', band: 'Everyday' },
      { id: 'confident', env: 'campus', scene: 'Presenting a class project', sentence: 'After practicing several times, Asha felt ____ enough to present her project to the class.', hint: 'She felt sure she could do it.', options: ['confident', 'confused', 'exhausted', 'narrow'], answer: 'confident', definition: 'Confident means feeling sure about your ability or about what you believe.', nuance: 'Self-assured is a close synonym. Certain usually means sure that something is true, not necessarily sure of your own ability.', example: 'He felt confident answering questions about his project.', family: 'Confidence & certainty', band: 'Everyday' },
      { id: 'quiet', env: 'campus', scene: 'The library', sentence: 'The library was ____; we could hear only the soft sound of pages turning.', hint: 'There was very little noise.', options: ['quiet', 'noisy', 'busy', 'rough'], answer: 'quiet', definition: 'Quiet means making little or no noise, or having little activity.', nuance: 'Silent means completely without sound. Quiet allows a little sound, as in this library.', example: 'We found a quiet table near the window.', family: 'Sound & atmosphere', band: 'Everyday' },
      { id: 'easy', env: 'campus', scene: 'Following a set of directions', sentence: 'The directions were ____ to follow, so I finished the form in two minutes.', hint: 'The task did not require much effort.', options: ['easy', 'difficult', 'urgent', 'messy'], answer: 'easy', definition: 'Easy means not difficult or requiring little effort.', nuance: 'Simple often means not complicated. Easy means not hard to do; something can be simple but still take effort.', example: 'The first exercise is easy once you see the pattern.', family: 'Difficulty & effort', band: 'Everyday' },
      { id: 'affordable', env: 'market', scene: 'Choosing a backpack', sentence: 'The backpack was good quality and ____ enough for my budget.', hint: 'The price fit what I could spend.', options: ['affordable', 'broken', 'distant', 'crowded'], answer: 'affordable', definition: 'Affordable means priced low enough for someone to pay for it.', nuance: 'Inexpensive is a close synonym. Cheap can also mean low-priced, but sometimes suggests poor quality.', example: 'We found an affordable place to eat near the station.', family: 'Money & value', band: 'Everyday' },
      { id: 'fresh', env: 'market', scene: 'Buying bread', sentence: 'The bread was baked this morning, so it was still ____ and smelled wonderful.', hint: 'It had been made recently, not left out for a long time.', options: ['fresh', 'stale', 'empty', 'late'], answer: 'fresh', definition: 'Fresh means recently made, picked, or prepared, and not old or spoiled.', nuance: 'New is broader. Fresh is especially common for food and for things that feel clean or recently prepared.', example: 'We bought fresh vegetables at the market.', family: 'Food & freshness', band: 'Everyday' },
      { id: 'busy', env: 'market', scene: 'Rush-hour street', sentence: 'The street became ____ at rush hour, with people crossing and shops full of customers.', hint: 'There was a lot of activity and many people.', options: ['busy', 'empty', 'silent', 'gentle'], answer: 'busy', definition: 'Busy describes a person with a lot to do or a place with lots of activity.', nuance: 'Crowded focuses on the number of people or things in a space. Busy focuses on activity; a place can be busy without feeling packed.', example: 'The market gets busy just before lunch.', family: 'Activity & crowds', band: 'Everyday' },
      { id: 'expensive', env: 'market', scene: 'Looking at a jacket', sentence: 'The jacket cost much more than I planned to spend; it was too ____.', hint: 'Its price was high.', options: ['expensive', 'affordable', 'fresh', 'quiet'], answer: 'expensive', definition: 'Expensive means costing a lot of money.', nuance: 'Costly is a close synonym, but expensive is the more common everyday choice.', example: 'That restaurant is a little too expensive for us tonight.', family: 'Money & value', band: 'Everyday' },
      { id: 'full', env: 'market', scene: 'Finding a café seat', sentence: 'Every seat was taken, so the café was ____ and we had to wait outside.', hint: 'There was no space left for another person.', options: ['full', 'empty', 'quiet', 'fresh'], answer: 'full', definition: 'Full means holding or containing as much as possible; here, there were no free seats.', nuance: 'Crowded describes a place with many people close together. Full tells you there is no room left.', example: 'The bus was full, so we waited for the next one.', family: 'Space & capacity', band: 'Everyday' },
      { id: 'polite', env: 'market', scene: 'Asking a shopkeeper for help', sentence: 'He said “excuse me” and “thank you”; he was ____ to the shopkeeper.', hint: 'His words showed good manners and respect.', options: ['polite', 'rude', 'impatient', 'messy'], answer: 'polite', definition: 'Polite means showing good manners and respect for other people.', nuance: 'Courteous is a close synonym and sounds a little more formal. Friendly means warm; someone can be polite without being especially friendly.', example: 'She was polite to everyone in the queue.', family: 'Manners & tone', band: 'Everyday' },
      { id: 'quick', env: 'workplace', scene: 'A meeting is about to start', sentence: 'We need a ____ reply before the meeting begins in five minutes.', hint: 'There is not much time, so the reply should come soon.', options: ['quick', 'slow', 'stale', 'wide'], answer: 'quick', definition: 'Quick means happening or done in a short time.', nuance: 'Fast often describes speed of movement. Quick commonly describes an action or task that does not take long.', example: 'I will send a quick update before lunch.', family: 'Speed & time', band: 'Everyday' },
      { id: 'honest', env: 'workplace', scene: 'Planning a project', sentence: 'Please be ____ about how long this will take, even if the estimate is not what we hoped.', hint: 'Share what is true; do not hide the facts.', options: ['honest', 'vague', 'crowded', 'fragile'], answer: 'honest', definition: 'Honest means truthful and not deliberately hiding or changing the facts.', nuance: 'Truthful is a close synonym. Frank means very direct; it can sometimes sound blunt.', example: 'An honest estimate helps the whole team plan.', family: 'Truth & trust', band: 'Everyday' },
      { id: 'patient', env: 'workplace', scene: 'Learning new software', sentence: 'The trainer explained the software step by step without getting annoyed; she was ____.', hint: 'She stayed calm while someone learned at their own pace.', options: ['patient', 'impatient', 'urgent', 'careless'], answer: 'patient', definition: 'Patient means able to wait or deal with difficulty without becoming annoyed.', nuance: 'Tolerant can mean accepting differences or behavior. Patient is especially natural when waiting or teaching someone.', example: 'Thanks for being patient while I learn the new system.', family: 'People & feelings', band: 'Everyday' },
      { id: 'organized', env: 'workplace', scene: 'Preparing shared files', sentence: 'Every file has a clear name and folder, so the project documents are ____.', hint: 'Everything is arranged neatly and easy to find.', options: ['organized', 'messy', 'urgent', 'upset'], answer: 'organized', definition: 'Organized means arranged in a clear, planned way.', nuance: 'Orderly is a close synonym. Tidy often describes a neat physical space; organized can describe plans, files, or a person’s work.', example: 'Her organized notes made the handover simple.', family: 'Order & planning', band: 'Everyday' },
      { id: 'available', env: 'workplace', scene: 'Arranging a call', sentence: 'Are you ____ for a short call at two o’clock, or are you already in a meeting?', hint: 'The question is whether you are free at that time.', options: ['available', 'busy', 'distant', 'sturdy'], answer: 'available', definition: 'Available means free to meet, use, or get at a particular time.', nuance: 'Free is the common conversational synonym for a person’s schedule. Available can sound a little more professional.', example: 'I am available after three if you want to talk.', family: 'Time & availability', band: 'Everyday' },
      { id: 'urgent', env: 'workplace', scene: 'A deadline is near', sentence: 'The deadline is in thirty minutes and the client is waiting, so this request is ____.', hint: 'It needs attention right away.', options: ['urgent', 'optional', 'distant', 'relaxed'], answer: 'urgent', definition: 'Urgent means needing attention or action very soon.', nuance: 'Pressing is a close synonym. Important means it matters; urgent means it needs to happen soon. Something can be important but not urgent.', example: 'Please call me if anything urgent comes up.', family: 'Time & priority', band: 'Everyday' },
      { id: 'tired', env: 'home', scene: 'After a long walk', sentence: 'After walking all day, I felt ____ and went to bed early.', hint: 'My body needed rest.', options: ['tired', 'energetic', 'hungry', 'polite'], answer: 'tired', definition: 'Tired means needing rest or sleep, often after activity.', nuance: 'Exhausted is much stronger. Sleepy means ready to sleep; you can be tired without feeling sleepy.', example: 'We were tired after carrying boxes upstairs.', family: 'Energy & rest', band: 'Everyday' },
      { id: 'messy', env: 'home', scene: 'After a cooking session', sentence: 'There were dishes on every surface and flour on the floor; the kitchen was ____.', hint: 'Things were not neat or in their usual places.', options: ['messy', 'tidy', 'empty', 'serene'], answer: 'messy', definition: 'Messy means untidy, disorganized, or covered with things that need cleaning up.', nuance: 'Untidy is a close synonym. Dirty means not clean; a room can be messy without being dirty.', example: 'My desk gets messy when I am working on a big project.', family: 'Home & order', band: 'Everyday' },
      { id: 'comfortable', env: 'home', scene: 'Settling into a chair', sentence: 'The chair was soft and supported my back, so it was very ____.', hint: 'Sitting in it felt pleasant, with no physical discomfort.', options: ['comfortable', 'uncomfortable', 'narrow', 'urgent'], answer: 'comfortable', definition: 'Comfortable means physically relaxed or pleasant, without discomfort.', nuance: 'Cozy often suggests warm and snug. Comfortable can describe a chair, clothes, a situation, or how someone feels.', example: 'Wear comfortable shoes for the walk.', family: 'Comfort & warmth', band: 'Everyday' },
      { id: 'kind', env: 'home', scene: 'Carrying groceries', sentence: 'Our neighbor saw us struggling with the bags and offered to carry one; that was ____.', hint: 'The offer showed care and thoughtfulness.', options: ['kind', 'selfish', 'harsh', 'distant'], answer: 'kind', definition: 'Kind means caring, helpful, and considerate toward other people.', nuance: 'Nice is a broad, casual word. Kind more clearly points to caring behavior.', example: 'It was kind of her to check whether we got home safely.', family: 'People & feelings', band: 'Everyday' },
      { id: 'happy', env: 'home', scene: 'Celebrating good news', sentence: 'When the team heard they had won, everyone felt ____.', hint: 'They felt pleasure and joy about the good result.', options: ['happy', 'upset', 'tired', 'careful'], answer: 'happy', definition: 'Happy means feeling pleasure, joy, or satisfaction.', nuance: 'Glad is a close everyday synonym, often used for a particular reason: “I’m glad you came.” Joyful is stronger and more expressive.', example: 'She was happy to hear that her friend was feeling better.', family: 'Feelings & mood', band: 'Everyday' },
      { id: 'hot', env: 'home', scene: 'A freshly poured cup of tea', sentence: 'The tea had just been poured, so it was too ____ to drink right away.', hint: 'It had a high temperature.', options: ['hot', 'cold', 'dry', 'quiet'], answer: 'hot', definition: 'Hot means having a high temperature.', nuance: 'Warm means pleasantly or mildly hot. In this sentence the tea is too high in temperature, so hot fits better.', example: 'Be careful—the soup is still hot.', family: 'Temperature & touch', band: 'Everyday' },
      { id: 'early', env: 'travel', scene: 'Catching a train', sentence: 'We arrived twenty minutes before the train left, so we were ____ for our departure.', hint: 'We arrived before the expected time.', options: ['early', 'late', 'lost', 'slow'], answer: 'early', definition: 'Early means before the expected, planned, or usual time.', nuance: 'Ahead of time is a common phrase with a similar meaning. Punctual means arriving at the agreed time—not necessarily before it.', example: 'We got to the airport early to avoid rushing.', family: 'Time & schedules', band: 'Everyday' },
      { id: 'safe', env: 'travel', scene: 'Walking down wet steps', sentence: 'Hold the handrail; it is the ____ way to go down these wet steps.', hint: 'This choice reduces the chance of getting hurt.', options: ['safe', 'dangerous', 'narrow', 'crowded'], answer: 'safe', definition: 'Safe means protected from danger or unlikely to cause harm.', nuance: 'Secure can mean protected or firmly fixed. Safe is the more common word for a low-risk choice or place.', example: 'Keep your bag somewhere safe on the bus.', family: 'Risk & safety', band: 'Everyday' },
      { id: 'nearby', env: 'travel', scene: 'Looking for a pharmacy', sentence: 'Is there a ____ pharmacy? I only have a few minutes before the bus leaves.', hint: 'The place should be close to where we are now.', options: ['nearby', 'distant', 'closed', 'expensive'], answer: 'nearby', definition: 'Nearby means close to the current place or another named place.', nuance: 'Close by is a natural everyday alternative. Near is usually followed by a place or object: “near the station.”', example: 'There is a small café nearby.', family: 'Places & distance', band: 'Everyday' },
      { id: 'open', env: 'travel', scene: 'Checking a café', sentence: 'The sign says the café is ____, and the lights inside are on, so we can go in.', hint: 'The café is operating and welcoming customers now.', options: ['open', 'closed', 'full', 'slow'], answer: 'open', definition: 'Open means operating or ready for people to enter or use.', nuance: 'Available can mean ready to use, but open is the normal word for a shop or café that is serving customers.', example: 'Is the museum open on Mondays?', family: 'Places & access', band: 'Everyday' },
      { id: 'strong', env: 'travel', scene: 'Walking in the wind', sentence: 'The wind was so ____ that umbrellas turned inside out.', hint: 'The wind had a lot of force.', options: ['strong', 'weak', 'gentle', 'quiet'], answer: 'strong', definition: 'Strong means having a lot of force or power; it is commonly used for wind, flavors, and physical ability.', nuance: 'Powerful is a close synonym in some contexts. Heavy is used for rain, but “heavy wind” is not the usual phrase.', example: 'A strong wind blew leaves across the road.', family: 'Force & intensity', band: 'Everyday' },
      { id: 'slow', env: 'travel', scene: 'Rush-hour traffic', sentence: 'The traffic was ____ because the cars barely moved through the roadworks.', hint: 'The cars were not moving fast.', options: ['slow', 'quick', 'early', 'nearby'], answer: 'slow', definition: 'Slow means moving at a low speed or taking a long time.', nuance: 'Slow is the adjective (“slow traffic”). Slowly is the adverb (“the cars moved slowly”).', example: 'The bus was slow through the crowded street.', family: 'Speed & time', band: 'Everyday' }
    ];

    const RELATED_WORDS = {
      curious: ['inquisitive', 'interested'], concise: ['brief', 'succinct'], puzzled: ['confused', 'perplexed'], accurate: ['correct', 'precise'],
      inspect: ['examine', 'scrutinize'], bustling: ['busy', 'lively'], reasonable: ['fair', 'sensible'], ripe: ['ready-to-eat', 'mature'],
      composed: ['calm', 'collected'], practical: ['useful', 'feasible'], diplomatic: ['tactful', 'considerate'], reliable: ['dependable', 'trustworthy'],
      cozy: ['comfortable', 'snug'], frugal: ['thrifty', 'economical'], murmured: ['whispered', 'muttered'], sturdy: ['strong', 'durable'],
      detour: ['alternative route', 'diversion'], frequent: ['often', 'regular'], hospitable: ['welcoming', 'gracious'], serene: ['peaceful', 'tranquil'],
      helpful: ['useful', 'supportive'], clear: ['understandable', 'plain'], difficult: ['hard', 'challenging'], confident: ['self-assured', 'sure'],
      quiet: ['silent', 'peaceful'], easy: ['simple', 'straightforward'], affordable: ['inexpensive', 'reasonably priced'], fresh: ['recent', 'new'],
      busy: ['active', 'crowded'], expensive: ['costly', 'high-priced'], full: ['filled', 'packed'], polite: ['respectful', 'courteous'],
      quick: ['fast', 'rapid'], honest: ['truthful', 'frank'], patient: ['tolerant', 'calm'], organized: ['orderly', 'well-arranged'],
      available: ['free', 'open'], urgent: ['pressing', 'immediate'], tired: ['weary', 'worn out'], messy: ['untidy', 'disorganized'],
      comfortable: ['at ease', 'cozy'], kind: ['caring', 'considerate'], happy: ['glad', 'pleased'], hot: ['warm', 'heated'],
      early: ['ahead of time', 'in advance'], safe: ['secure', 'protected'], nearby: ['close by', 'near'], open: ['accessible', 'operating'],
      strong: ['powerful', 'forceful'], slow: ['unhurried', 'not fast']
    };
    const ANTONYMS = {
      curious: ['indifferent', 'uninterested'], concise: ['wordy', 'long-winded'], puzzled: ['certain', 'sure'], accurate: ['inaccurate', 'incorrect'],
      inspect: ['ignore', 'overlook'], bustling: ['quiet', 'still'], reasonable: ['unreasonable', 'excessive'], ripe: ['unripe', 'raw'],
      composed: ['agitated', 'flustered'], practical: ['impractical', 'unworkable'], diplomatic: ['tactless', 'blunt'], reliable: ['unreliable', 'inconsistent'],
      cozy: ['uncomfortable', 'cold'], frugal: ['wasteful', 'extravagant'], murmured: ['shouted', 'yelled'], sturdy: ['flimsy', 'weak'],
      detour: ['direct route', 'straight route'], frequent: ['rare', 'infrequent'], hospitable: ['unwelcoming', 'cold'], serene: ['hectic', 'agitated'],
      helpful: ['unhelpful', 'obstructive'], clear: ['confusing', 'unclear'], difficult: ['easy', 'simple'], confident: ['unsure', 'uncertain'],
      quiet: ['noisy', 'loud'], easy: ['difficult', 'hard'], affordable: ['expensive', 'costly'], fresh: ['stale', 'old'],
      busy: ['quiet', 'inactive'], expensive: ['cheap', 'inexpensive'], full: ['empty', 'vacant'], polite: ['rude', 'impolite'],
      quick: ['slow', 'unhurried'], honest: ['dishonest', 'deceitful'], patient: ['impatient', 'restless'], organized: ['messy', 'disorganized'],
      available: ['busy', 'unavailable'], urgent: ['non-urgent', 'routine'], tired: ['rested', 'energetic'], messy: ['tidy', 'neat'],
      comfortable: ['uncomfortable', 'uneasy'], kind: ['unkind', 'mean'], happy: ['sad', 'unhappy'], hot: ['cold', 'cool'],
      early: ['late', 'behind schedule'], safe: ['dangerous', 'unsafe'], nearby: ['far away', 'distant'], open: ['closed', 'shut'],
      strong: ['weak', 'feeble'], slow: ['fast', 'quick']
    };

    const SYNONYM_ROUNDS = [
      ['helpful', 'The step-by-step guide was helpful when I set up the new phone.', 'Which everyday word is closest to “helpful” here?', ['useful', 'polite', 'quiet', 'tired'], 'useful', 'Both words mean that something makes a task easier. Helpful often describes a person, action, or piece of information; useful often describes how something can be used.'],
      ['difficult', 'The last puzzle was difficult, and it took the group a long time to solve.', 'Which common word is closest to “difficult” here?', ['hard', 'clear', 'early', 'gentle'], 'hard', 'Hard is the everyday near-synonym for difficult in this sentence. Challenging is also related, but can sound more positive.'],
      ['quick', 'I sent a quick message to say I would be five minutes late.', 'Which common word is closest to “quick” here?', ['fast', 'careful', 'patient', 'empty'], 'fast', 'Quick and fast both describe speed. Quick is especially natural for a short action or task.'],
      ['happy', 'She was happy to see her old friend after several years.', 'Which everyday word is closest to “happy” in this sentence?', ['glad', 'worried', 'sleepy', 'narrow'], 'glad', 'Glad is a very common synonym for happy, especially when you name the reason: “glad to see you.”'],
      ['kind', 'It was kind of the neighbor to carry the heavy bags upstairs.', 'Which word is closest to “kind” here?', ['caring', 'selfish', 'urgent', 'bright'], 'caring', 'Caring describes showing concern for another person. It is close to kind in this helpful action.'],
      ['honest', 'Please give me an honest answer, even if it is not what I hoped to hear.', 'Which word is closest to “honest” here?', ['truthful', 'secretive', 'patient', 'narrow'], 'truthful', 'Truthful is a direct near-synonym: the answer matches what the speaker believes is true.'],
      ['affordable', 'The family found an affordable place to stay near the station.', 'Which word is closest to “affordable” when talking about price?', ['inexpensive', 'distant', 'empty', 'noisy'], 'inexpensive', 'Inexpensive means not costing much. Affordable adds that the price fits someone’s budget.'],
      ['clear', 'The map was clear, so we knew exactly which path to take.', 'Which word is closest to “clear” in this sentence?', ['understandable', 'crowded', 'expensive', 'noisy'], 'understandable', 'Understandable means easy to follow or make sense of, as clear does here.'],
      ['busy', 'The market street was busy, with people filling the sidewalks.', 'Which word is closest to “busy” for a place full of people?', ['crowded', 'quiet', 'late', 'polite'], 'crowded', 'Crowded focuses on how many people are in a space. Busy focuses on activity; in this sentence they overlap.'],
      ['comfortable', 'After a long walk, I felt comfortable sitting in the soft chair.', 'Which phrase is closest to “comfortable” for how someone feels?', ['at ease', 'hungry', 'busy', 'narrow'], 'at ease', 'At ease means relaxed and free from worry or discomfort. Comfortable can describe both a person and a physical place or object.'],
      ['nearby', 'There is a nearby pharmacy just around the corner from the hotel.', 'Which phrase is closest to “nearby” here?', ['close by', 'far away', 'turned off', 'closed'], 'close by', 'Close by is a natural everyday alternative for something a short distance away.'],
      ['patient', 'The coach was patient while the new player practiced the steps again.', 'Which word is closest to “patient” in this situation?', ['tolerant', 'rushed', 'hungry', 'fragile'], 'tolerant', 'Patient and tolerant can both describe someone who stays calm while another person learns or makes mistakes.']
    ].map(([wordId, sentence, prompt, options, answer, explanation]) => ({ id: `syn-${wordId}`, type: 'synonym', wordId, sentence, prompt, options, answer, explanation }));

    const ANTONYM_ROUNDS = [
      ['full', 'Every seat on the bus was taken; it was full.', 'What is the natural opposite of “full” in this sentence?', ['empty', 'busy', 'open', 'quiet'], 'empty', 'Here full means there is no room left. Empty means there is nobody or nothing inside.'],
      ['fresh', 'The bread had been left uncovered for days, so it was stale.', 'What is the opposite of “stale” for bread?', ['fresh', 'soft', 'warm', 'sweet'], 'fresh', 'Fresh bread is recently made and pleasant to eat; stale bread is old and no longer fresh.'],
      ['hot', 'The tea was hot just after it was poured.', 'What is the opposite of “hot” for temperature?', ['cold', 'spicy', 'strong', 'sweet'], 'cold', 'In this sentence hot means high in temperature, so cold is the opposite. Hot can mean spicy in another context.'],
      ['early', 'We arrived at the station after the train had already left; we were late.', 'What is the opposite of “late” for arriving on time?', ['early', 'quick', 'slow', 'nearby'], 'early', 'Early means before the expected time; late means after it.'],
      ['safe', 'The broken steps were dangerous to use in the rain.', 'What is the opposite of “dangerous” here?', ['safe', 'narrow', 'crowded', 'wet'], 'safe', 'Safe means unlikely to cause harm. Dangerous means there is a real risk of harm.'],
      ['open', 'The café had locked its doors for the night; it was closed.', 'What is the opposite of “closed” for a café?', ['open', 'busy', 'full', 'nearby'], 'open', 'An open café is operating and ready to serve customers; a closed one is not.'],
      ['slow', 'The road was clear, and the cars moved fast.', 'What is the opposite of “fast” for traffic?', ['slow', 'late', 'busy', 'safe'], 'slow', 'Slow and fast describe opposite speeds.'],
      ['happy', 'He felt sad when his friend moved to another city.', 'What is the opposite of “sad” for a feeling?', ['happy', 'tired', 'calm', 'polite'], 'happy', 'Happy and sad are common opposites for positive and negative feelings.'],
      ['patient', 'She became impatient when the queue stopped moving.', 'What is the opposite of “impatient” here?', ['patient', 'careful', 'helpful', 'honest'], 'patient', 'Patient describes someone who can wait without becoming annoyed; impatient describes the opposite reaction.'],
      ['honest', 'He lied about breaking the cup, so his answer was dishonest.', 'What is the opposite of “dishonest”?', ['honest', 'quiet', 'urgent', 'messy'], 'honest', 'An honest answer is truthful; a dishonest one deliberately hides or changes the facts.'],
      ['messy', 'The desk was neat, with every paper in its folder.', 'What is the opposite of “neat” for a room or desk?', ['messy', 'small', 'dirty', 'busy'], 'messy', 'A messy space is untidy. Neat and tidy are common opposites in this context.'],
      ['affordable', 'The hotel cost far more than we could pay; it was expensive.', 'What is the opposite of “expensive” when talking about price?', ['affordable', 'popular', 'useful', 'fresh'], 'affordable', 'Affordable means priced within someone’s budget; expensive means costing a lot.'],
      ['busy', 'The street was quiet after all the shops had closed.', 'What is the opposite of “quiet” for a street full of activity?', ['busy', 'wide', 'crowded', 'quick'], 'busy', 'Busy describes a place with lots of activity; quiet describes one with little activity or noise.'],
      ['polite', 'He interrupted everyone and shouted at the cashier; he was rude.', 'What is the opposite of “rude” in this situation?', ['polite', 'quiet', 'honest', 'kind'], 'polite', 'Polite describes showing good manners and respect. Rude describes behavior that is disrespectful.'],
      ['strong', 'The wind was weak, so the leaves barely moved.', 'What is the opposite of “weak” for the wind?', ['strong', 'cold', 'fresh', 'fast'], 'strong', 'A strong wind has a lot of force; a weak wind has little force.'],
      ['difficult', 'The first exercise was easy, with only one short step.', 'What is the opposite of “easy” for a task?', ['difficult', 'final', 'short', 'confusing'], 'difficult', 'Difficult means not easy to do. A confusing task may be difficult, but the words do not mean exactly the same thing.'],
      ['clear', 'The directions were confusing, so we took the wrong turn.', 'What is the opposite of “confusing” for instructions?', ['clear', 'polite', 'brief', 'early'], 'clear', 'Clear instructions are easy to understand; confusing instructions are hard to follow.'],
      ['confident', 'Before practicing, he felt unsure about speaking to the group.', 'What is the opposite of “unsure” about your ability?', ['confident', 'happy', 'quiet', 'careful'], 'confident', 'Confident means feeling sure about your ability or judgment; unsure means lacking that confidence.'],
      ['tired', 'After a good night’s sleep, she felt rested and ready to go.', 'What is the opposite of “tired” after getting enough sleep?', ['rested', 'sleepy', 'slow', 'full'], 'rested', 'Rested describes feeling refreshed after sleep or a break, the opposite state to feeling tired.'],
      ['quick', 'The old computer was slow to start, so we waited.', 'What is the opposite of “slow” for a task?', ['quick', 'polite', 'late', 'easy'], 'quick', 'A quick task takes little time; a slow task takes longer.']
    ].map(([wordId, sentence, prompt, options, answer, explanation]) => ({ id: `ant-${wordId}`, type: 'antonym', wordId, sentence, prompt, options, answer, explanation }));

    const PHRASE_ROUNDS = [
      ['heavy-rain', 'We got caught in ____ on the way home, so we waited under an awning.', ['heavy rain', 'strong rain', 'thick rain', 'large rain'], 'heavy rain', 'Heavy rain is the usual everyday collocation for a lot of rain. “Strong” commonly goes with wind, not rain.', null],
      ['take-break', 'After two hours at the desk, I stood up to ____.', ['take a break', 'do a break', 'make a break', 'put a break'], 'take a break', 'Take a break is the common phrase for stopping work or study to rest briefly.', 'tired'],
      ['pay-attention', 'Please ____ to the safety instructions before we begin.', ['pay attention', 'spend attention', 'cost attention', 'put attention'], 'pay attention', 'Pay attention to is the natural phrase meaning listen or watch carefully.', 'clear'],
      ['strong-coffee', 'I like ____ in the morning because it has a bold flavor.', ['strong coffee', 'powerful coffee', 'heavy coffee', 'hard coffee'], 'strong coffee', 'Strong coffee is the common phrase for coffee with an intense flavor.', 'strong'],
      ['heavy-traffic', 'We left early to avoid the ____ near the city center.', ['heavy traffic', 'strong traffic', 'thick traffic', 'large traffic'], 'heavy traffic', 'Heavy traffic is the usual phrase for many vehicles moving slowly or crowded roads.', 'busy'],
      ['keep-promise', 'She said she would call at noon and did exactly what she said: she ____.', ['kept her promise', 'made her promise', 'took her promise', 'said her promise'], 'kept her promise', 'Keep a promise means do what you said you would do.', 'reliable'],
      ['save-time', 'Using the shortcut will ____ on the drive.', ['save time', 'store time', 'win time', 'hold time'], 'save time', 'Save time is a common phrase meaning use less time or make a task quicker.', 'quick'],
      ['make-room', 'Move one chair so we can ____ for another guest.', ['make room', 'do room', 'take room', 'keep room'], 'make room', 'Make room means create space for someone or something.', 'full'],
      ['get-sleep', 'You look tired; try to ____ before the early flight.', ['get some sleep', 'make some sleep', 'do some sleep', 'take some sleep'], 'get some sleep', 'Get some sleep is the common phrase for resting by sleeping.', 'tired'],
      ['make-progress', 'If you practice a little each day, you will ____ toward your goal.', ['make progress', 'do progress', 'take progress', 'build a progress'], 'make progress', 'Make progress is the standard everyday collocation for moving closer to a goal.', 'confident']
    ].map(([id, sentence, options, answer, explanation, wordId]) => ({ id: `phrase-${id}`, type: 'phrase', wordId, sentence, prompt: 'Which phrase sounds natural in this context?', options, answer, explanation }));

    const STORY_ROUNDS = [
      { id: 'story-parcel', type: 'story', wordId: 'honest', band: 'Everyday', scene: 'A parcel at the front desk', story: 'A parcel arrives at Nila’s building with another tenant’s name on it. She notices the mistake and leaves it with the front-desk attendant instead of taking it upstairs.', prompt: 'Which word best describes Nila’s choice?', options: ['honest', 'selfish', 'vague', 'reckless'], answer: 'honest', explanation: 'Nila does not keep something that belongs to another person. Honest describes truthful and fair behavior.', clue: 'The detail that matters is what Nila does with a package that is not hers.' },
      { id: 'story-update', type: 'story', wordId: 'clear', band: 'Everyday', scene: 'A delayed delivery', story: 'A project will be one day late. Farah tells the client what caused the delay and gives a realistic new delivery time, rather than saying “soon.”', prompt: 'What is strongest about Farah’s update?', options: ['clear', 'crowded', 'fragile', 'impatient'], answer: 'clear', explanation: 'The update explains the problem and gives a specific next step, so the information is easy to understand.', clue: 'Look at whether the client can understand what happened and what comes next.' },
      { id: 'story-feedback', type: 'story', wordId: 'diplomatic', band: 'Stretch', scene: 'Feedback after rehearsal', story: 'After a rehearsal, Rowan tells a friend what worked well, then offers one specific suggestion without embarrassing them in front of the group.', prompt: 'Which word best describes Rowan’s approach?', options: ['diplomatic', 'careless', 'urgent', 'noisy'], answer: 'diplomatic', explanation: 'Diplomatic describes handling a sensitive moment with tact while still saying something useful.', clue: 'Rowan gives honest feedback and takes care with the other person’s feelings.' },
      { id: 'story-cafe', type: 'story', wordId: 'polite', band: 'Everyday', scene: 'A mix-up at a café', story: 'A café bill includes a drink that was never ordered. Amir calmly points to the receipt and asks the cashier if they can check it together.', prompt: 'How does Amir speak to the cashier?', options: ['polite', 'rude', 'dishonest', 'sleepy'], answer: 'polite', explanation: 'Amir explains the problem without insulting anyone. Polite describes showing good manners and respect.', clue: 'Notice his calm request, not the billing mistake.' },
      { id: 'story-bridge', type: 'story', wordId: 'safe', band: 'Everyday', scene: 'A closed footbridge', story: 'A storm closes the footbridge on Mia’s route. She takes a longer, well-lit path instead of climbing around the barrier.', prompt: 'Which word best describes Mia’s choice?', options: ['safe', 'risky', 'messy', 'distant'], answer: 'safe', explanation: 'Mia chooses a route that avoids a clear hazard. Safe means protected from danger or unlikely to cause harm.', clue: 'The longer route avoids the closed bridge and its barrier.' },
      { id: 'story-bus', type: 'story', wordId: 'kind', band: 'Everyday', scene: 'A crowded bus', story: 'The bus is full, and a passenger carrying a sleeping child is standing. Sam offers his seat and stands for the rest of the ride.', prompt: 'Which word best describes Sam’s action?', options: ['kind', 'selfish', 'harsh', 'urgent'], answer: 'kind', explanation: 'Sam notices someone who could use help and gives up his seat. Kind describes caring and considerate behavior.', clue: 'Think about what Sam’s offer shows toward another person.' },
      { id: 'story-brief-update', type: 'story', wordId: 'concise', band: 'Stretch', scene: 'A short team update', story: 'At a busy check-in, Lee has half a minute to explain why a task is blocked. Lee names the obstacle, what has already been tried, and the help needed—without adding unrelated detail.', prompt: 'Which word best describes Lee’s update?', options: ['concise', 'vague', 'casual', 'crowded'], answer: 'concise', explanation: 'The update is short but still clear and complete. Concise means using no more words than needed.', clue: 'The useful details are there, but the explanation stays brief.' },
      { id: 'story-host', type: 'story', wordId: 'hospitable', band: 'Stretch', scene: 'A guest arrives early', story: 'A guest reaches the house before dinner is ready. Their host offers a place to rest, checks whether they need anything, and makes room at the table.', prompt: 'Which word best describes the host?', options: ['hospitable', 'distant', 'impatient', 'reckless'], answer: 'hospitable', explanation: 'The host makes a visitor feel welcome. Hospitable specifically describes being warm and generous to guests.', clue: 'Think about how the host treats a visitor, not how formal the home is.' },
      { id: 'story-small-test', type: 'story', wordId: 'practical', band: 'Everyday', scene: 'A project with a tight budget', story: 'A team likes an ambitious idea, but the budget is small and the deadline is Friday. They choose one useful feature to test this week before deciding whether to expand the project.', prompt: 'Which word best describes the team’s first step?', options: ['practical', 'imaginary', 'delicate', 'distant'], answer: 'practical', explanation: 'The team chooses something useful that can actually be done with its time and budget. Practical means workable in real conditions.', clue: 'The first step fits the team’s actual time and budget.' }
    ];

    const LISTEN_ROUNDS = [
      { id: 'listen-quiet', type: 'listen', wordId: 'quiet', audioWord: 'quiet', prompt: 'Listen, then choose the word you hear.', options: ['quiet', 'quite', 'quick', 'queen'], answer: 'quiet', explanation: 'Quiet usually has two syllables; quite has one. Replay the word and notice the extra vowel sound.', clue: 'Use the speaker button as often as you need.' },
      { id: 'listen-full', type: 'listen', wordId: 'full', audioWord: 'full', prompt: 'Listen, then choose the word you hear.', options: ['full', 'fool', 'fall', 'pull'], answer: 'full', explanation: 'Full has the short vowel sound in “book.” Fool has a longer vowel, while fall has a different vowel sound.', clue: 'Vowel sounds can vary by accent; replay the audio in your chosen voice.' },
      { id: 'listen-strong', type: 'listen', wordId: 'strong', audioWord: 'strong', prompt: 'Listen, then choose the word you hear.', options: ['strong', 'wrong', 'song', 'string'], answer: 'strong', explanation: 'Strong begins with an “str” sound. Listen for the first consonant cluster before the vowel.', clue: 'Try listening once at normal speed, then once slowly.' },
      { id: 'listen-hot', type: 'listen', wordId: 'hot', audioWord: 'hot', prompt: 'Listen, then choose the word you hear.', options: ['hot', 'hat', 'hut', 'hit'], answer: 'hot', explanation: 'These words differ mainly in their vowel. The exact sound of “hot” varies across English accents.', clue: 'Your selected accent changes the voice used for this round.' },
      { id: 'listen-polite', type: 'listen', wordId: 'polite', audioWord: 'polite', prompt: 'Listen, then choose the word you hear.', options: ['polite', 'police', 'policy', 'politely'], answer: 'polite', explanation: 'Polite has two syllables and ends with a “t” sound. Listen for the final consonant.', clue: 'The sound is available from the speaker button; no recording is sent.' }
    ];

    const GAME_INFO = {
      usage: { name: 'Usage Studio', icon: '💬', label: 'COMMON ENGLISH IN CONTEXT', description: 'Choose or interpret everyday expressions in realistic situations. Built for intermediate learners.', learning: 'Distinguish natural expressions and their precise meanings.', count: `${USAGE_ROUNDS.length} practice tasks`, color: '#e6ecf5' },
      scene: { name: 'Scene Pick', icon: '🧭', label: 'CHOOSE BY CONTEXT', description: 'Read a short situation and choose the word that fits it best.', learning: 'Use sentence clues to choose a word.', count: '50 scene cards', color: '#e8f0dc' },
      synonym: { name: 'Synonym Switch', icon: '🔁', label: 'SIMILAR MEANING', description: 'Find a nearby word, then notice how the tone or strength changes.', learning: 'Tell near-synonyms apart.', count: `${SYNONYM_ROUNDS.length} quick rounds`, color: '#e1edf3' },
      antonym: { name: 'Opposite Snap', icon: '↔️', label: 'OPPOSITE MEANING', description: 'Choose the opposite that makes sense in this sentence.', learning: 'Use opposites in context.', count: `${ANTONYM_ROUNDS.length} quick rounds`, color: '#f5e8dc' },
      phrase: { name: 'Phrase Finder', icon: '🧩', label: 'NATURAL PHRASES', description: 'Complete everyday word pairs such as “heavy rain” and “pay attention.”', learning: 'Learn word combinations people commonly use.', count: `${PHRASE_ROUNDS.length} quick rounds`, color: '#eee7f1' },
      listen: { name: 'Listen & Match', icon: '🔊', label: 'LISTENING', description: 'Hear a word in your selected English accent, then match it to the spelling.', learning: 'Connect spoken sounds with written words.', count: `${LISTEN_ROUNDS.length} listening rounds`, color: '#e3eee9' },
      story: { name: 'Story Clues', icon: '📖', label: 'READ A SHORT STORY', description: 'Read a small real-life dilemma and use its details to choose the right word.', learning: 'Infer meaning from a short situation.', count: `${STORY_ROUNDS.length} short stories`, color: '#f4e9df' },
      recall: { name: 'Recall & Type', icon: '⌨️', label: 'RECALL FROM MEMORY', description: 'Read a scene and type the missing word without answer choices.', learning: 'Retrieve a word from context—not just recognize it.', count: 'Level-matched words', color: '#e9efe2' }
    };

    const NUANCE_SETS = {
      anger: {
        label: 'Anger & frustration', title: 'Not every kind of anger feels the same.',
        description: 'Choose a word that shows how strong the feeling is—or what caused it.',
        note: 'These words overlap, but they are not interchangeable. “Indignant” points to unfairness, not simply a stronger level of anger.',
        words: [
          { word: 'annoyed', tag: 'Mild frustration', detail: 'A little bothered or displeased.', example: 'I was annoyed when the app froze again.' },
          { word: 'irritated', tag: 'More persistent', detail: 'Bothered, often because something keeps happening.', example: 'I was irritated by the repeated notification sound.' },
          { word: 'furious', tag: 'Very intense', detail: 'Extremely angry; a much stronger word.', example: 'She was furious when the ticket was canceled without warning.' },
          { word: 'indignant', tag: 'Unfairness', detail: 'Angry because something seems unfair or wrong.', example: 'He felt indignant about being blamed for a mistake he did not make.' }
        ]
      },
      looking: {
        label: 'Ways of looking', title: 'A look can be quick, curious, or careful.',
        description: 'These words describe different ways of looking—not a simple “more to less” scale.',
        note: 'The situation matters: “stare” can sound rude, while “inspect” implies careful checking.',
        words: [
          { word: 'glance', tag: 'Quick look', detail: 'Look briefly, usually for a short moment.', example: 'She glanced at the clock before leaving.' },
          { word: 'gaze', tag: 'Steady look', detail: 'Look steadily for a while, often with interest or admiration.', example: 'They gazed at the stars above the lake.' },
          { word: 'stare', tag: 'Fixed look', detail: 'Look fixedly for a long time; it can seem impolite.', example: 'It is not polite to stare at strangers.' },
          { word: 'inspect', tag: 'Careful check', detail: 'Look closely to check details or condition.', example: 'The mechanic inspected the tire for damage.' }
        ]
      },
      speaking: {
        label: 'Ways of speaking', title: 'Small changes in a speaking verb add a lot.',
        description: 'Pick a verb that signals volume, intention, or feeling—not just “said.”',
        note: 'A verb can carry extra emotion. “Mutter” may suggest annoyance; “announce” suggests sharing something publicly.',
        words: [
          { word: 'whisper', tag: 'Very quiet', detail: 'Speak very softly, usually so others do not hear.', example: 'He whispered the answer during the film.' },
          { word: 'murmur', tag: 'Soft voice', detail: 'Speak in a low, gentle voice.', example: '“You did well,” she murmured.' },
          { word: 'mutter', tag: 'Under the breath', detail: 'Speak quietly and not very clearly; it can sound annoyed.', example: 'He muttered something about the long queue.' },
          { word: 'announce', tag: 'Public message', detail: 'Tell people something clearly so a group can hear.', example: 'The guide announced the departure time.' }
        ]
      },
      brief: {
        label: 'Brief & clear', title: 'Short is not always concise.',
        description: 'Compare words for messages, summaries, and explanations.',
        note: '“Concise” usually combines brevity with clarity. A message can be brief but still leave out important information.',
        words: [
          { word: 'brief', tag: 'Short in length', detail: 'Lasting or taking only a short time or space.', example: 'We had a brief chat before class.' },
          { word: 'concise', tag: 'Short + clear', detail: 'Brief and clear, with no unnecessary words.', example: 'Please keep your update concise.' },
          { word: 'succinct', tag: 'Compact & precise', detail: 'Expressed in very few words, often with precision.', example: 'Her succinct reply answered the question.' },
          { word: 'terse', tag: 'Can sound abrupt', detail: 'Very short and direct; it can seem unfriendly.', example: 'His terse message made me wonder if he was upset.' }
        ]
      }
    };

    const TONE_SCENARIOS = [
      { emoji: '🗂️', context: 'A teammate has not sent the notes yet. You need them this afternoon and want to be polite and clear.', goal: 'Polite + specific', instruction: 'Choose the message that best fits.', options: [
        { text: 'Could you send me the notes by 3 p.m., please?', correct: true, explanation: 'This is courteous and gives a clear deadline.' },
        { text: 'Send the notes now. I need them.', correct: false, explanation: 'It is clear, but may sound abrupt for a routine request.' },
        { text: 'Whenever you eventually send those notes, I guess.', correct: false, explanation: 'This may sound sarcastic rather than polite.' }
      ] },
      { emoji: '💬', context: 'A friend tells you they had a difficult day. You want to sound supportive, not dismissive.', goal: 'Warm + empathetic', instruction: 'Choose the most supportive reply.', options: [
        { text: 'That sounds really tough. Want to talk about it?', correct: true, explanation: 'It acknowledges the feeling and gently offers support.' },
        { text: 'It is not a big deal. Forget about it.', correct: false, explanation: 'This can minimize how the person feels.' },
        { text: 'You should have planned better.', correct: false, explanation: 'This jumps to blame instead of listening.' }
      ] },
      { emoji: '📚', context: 'You need a little more time to finish an assignment and are writing to your teacher.', goal: 'Respectful + direct', instruction: 'Choose the message that best fits a respectful request.', options: [
        { text: 'Could I please have until Friday to submit the assignment?', correct: true, explanation: 'It is respectful, direct, and gives a specific proposed date.' },
        { text: 'I cannot do it. You will have to wait.', correct: false, explanation: 'This sounds demanding and does not make a clear request.' },
        { text: 'Hey, the assignment is not happening today lol.', correct: false, explanation: 'This is too casual for a respectful request to a teacher.' }
      ] }
    ];

    const QUESTION_BY_ID = Object.assign(Object.create(null), Object.fromEntries(QUESTIONS.map(q => [q.id, q])));
    const ROUND_BY_ID = Object.assign(Object.create(null), Object.fromEntries([...SYNONYM_ROUNDS, ...ANTONYM_ROUNDS, ...PHRASE_ROUNDS, ...STORY_ROUNDS, ...LISTEN_ROUNDS, ...USAGE_ROUNDS].map(round => [round.id, round])));
    const STORAGE_KEY = 'wordtrail-progress-v1';
    const SESSION_STORAGE_KEY = 'wordtrail-active-session-v1';
    let currentUser = null;
    let cloudAuth = null;
    let cloudApi = null;
    let cloudModulesPromise = null;
    let cloudSyncTimer = null;
    let cloudLoadingPromise = null;
    let cloudLoadingUserId = null;
    let cloudLoadedUserId = null;
    let pendingGuestSync = false;
    let lastCloudErrorToast = 0;
    function userProgressKey(userId) { return `wordtrail-user-progress:${userId}`; }
    function userSessionKey(userId) { return `wordtrail-active-session:${userId}`; }
    function progressStorageKey() { return currentUser && /^[0-9a-f-]{36}$/i.test(currentUser.id) ? userProgressKey(currentUser.id) : STORAGE_KEY; }
    function activeSessionStorageKey() { return currentUser && /^[0-9a-f-]{36}$/i.test(currentUser.id) ? userSessionKey(currentUser.id) : SESSION_STORAGE_KEY; }
    const STRETCH_WORD_IDS = new Set(['concise', 'diplomatic', 'frugal', 'hospitable', 'serene', 'bustling', 'murmured']);
    QUESTIONS.forEach(question => { if (!question.band) question.band = STRETCH_WORD_IDS.has(question.id) ? 'Stretch' : 'Everyday'; });
    const LEVELS = {
      beginner: { label: 'Beginner', title: 'I’m new to English', description: 'I know a few words and want clear clues and familiar situations.' },
      intermediate: { label: 'Intermediate', title: 'I know the basics', description: 'I can manage familiar conversations and want more natural word choices.' },
      advanced: { label: 'Advanced', title: 'I’m comfortable in English', description: 'I want to work on nuance, precision, and less common useful words.' },
      unsure: { label: 'Not sure yet', title: 'I’m not sure', description: 'Start with everyday words. You can change your level whenever you like.' }
    };
    const ACCENT_OPTIONS = [
      { value: 'en-US', label: 'US English' },
      { value: 'en-GB', label: 'UK English' },
      { value: 'en-AU', label: 'Australian English' },
      { value: 'en-IN', label: 'Indian English' },
      { value: 'en-CA', label: 'Canadian English' },
      { value: 'en-IE', label: 'Irish English' }
    ];
    const GLOSS_LOCALES = { en: 'en-US', es: 'es-ES', hi: 'hi-IN', bn: 'bn-BD', fr: 'fr-FR' };
    const ONBOARDING_LANGUAGES = [
      { code: 'en', key: 'English', native: 'English' },
      { code: 'es', key: 'Spanish', native: 'Español' },
      { code: 'hi', key: 'Hindi', native: 'हिन्दी' },
      { code: 'bn', key: 'Bangla', native: 'বাংলা' },
      { code: 'fr', key: 'French', native: 'Français' }
    ];
    const UI_TRANSLATIONS = {
      es: {
        'Skip to main content':'Saltar al contenido principal','Your space':'Tu espacio','YOUR STREAK':'TU RACHA','days':'días','Home':'Inicio','Practice':'Práctica','Explore worlds':'Explorar mundos','Nuance lab':'Matices','My wordbook':'Mi vocabulario','Words':'Palabras','Worlds':'Mundos','Settings':'Ajustes','Interface language':'Idioma de la interfaz','Gloss language':'Idioma del glosario','Gloss & speech language':'Idioma de glosa y voz','Show native-language word glosses':'Mostrar equivalencias en tu idioma','Target-language speech':'Voz en el idioma meta','English voice':'Voz en inglés','Dark theme':'Tema oscuro','Light theme':'Tema claro','Answer sounds: off':'Sonidos: desactivados','Answer sounds: on':'Sonidos: activados','Choose level':'Elegir nivel','Level:':'Nivel:','How comfortable are you with English?':'¿Qué tan cómodo te sientes con el inglés?','This is not a test.':'Esto no es un examen.','Beginner':'Principiante','Intermediate':'Intermedio','Advanced':'Avanzado','Not sure yet':'Aún no lo sé','Home & friends':'Hogar y amistades','What would you like to practice?':'¿Qué te gustaría practicar?','Choose a practice type':'Elige un tipo de práctica','My wordbook':'Mi vocabulario','Words you saved.':'Palabras guardadas.','Words to revisit.':'Palabras para repasar.','Search by word, meaning, or example':'Buscar por palabra, significado o ejemplo','For example: calm, fair, or a phrase':'Por ejemplo: tranquilo, justo o una frase','Clear search':'Borrar búsqueda','No matching words.':'No hay palabras coincidentes.','No saved words yet.':'Aún no hay palabras guardadas.','No words are due yet.':'Aún no hay palabras pendientes.','Review as flashcards':'Repasar con tarjetas','Flip card':'Voltear tarjeta','Reveal the word':'Mostrar la palabra','Rate your recall':'Valora tu recuerdo','Easy':'Fácil','Medium':'Intermedio','Hard':'Difícil','Leave this trail':'Salir de esta ruta','Back to home':'Volver al inicio','Back home':'Volver al inicio','Next scene':'Siguiente escena','Next turn':'Siguiente turno','Next situation':'Siguiente situación','See your results':'Ver resultados','That fits the moment.':'Esa palabra encaja.','A closer fit is':'Una opción más precisa es','A small clue:':'Una pequeña pista:','Context is your clue':'El contexto es tu pista','No timer. Take a moment and choose with care.':'Sin reloj. Tómate un momento y elige con calma.','No timer. Stop whenever you need.':'Sin reloj. Puedes parar cuando quieras.','Nice fit.':'¡Encaja bien!','Try noticing the goal.':'Fíjate en el objetivo.','A thoughtful fit.':'Una buena elección.','Near-synonyms:':'Sinónimos cercanos:','Opposites:':'Antónimos:','The nuance:':'El matiz:','Gloss':'Equivalencia','Listen':'Escuchar','Tone Shift':'Cambio de tono','Review words':'Repasar palabras','YOUR WORD COLLECTION':'TU COLECCIÓN DE PALABRAS','Keep your progress portable':'Lleva tu progreso contigo','Download backup':'Descargar copia','Restore backup':'Restaurar copia','Word review':'Repaso de palabras','Round complete.':'Ronda completada.','No timer.':'Sin reloj.','Recall the word':'Recuerda la palabra','Choose how well you remembered it.':'Valora cuánto la recordaste.','Tomorrow':'Mañana','In 3 days':'En 3 días','In 7 days':'En 7 días','Flashcard progress':'Progreso de tarjetas'
      },
      fr: {
        'Skip to main content':'Aller au contenu principal','Your space':'Votre espace','YOUR STREAK':'VOTRE SÉRIE','days':'jours','Home':'Accueil','Practice':'Pratique','Explore worlds':'Explorer les univers','Nuance lab':'Nuances','My wordbook':'Mon vocabulaire','Words':'Mots','Worlds':'Univers','Settings':'Réglages','Interface language':'Langue de l’interface','Gloss language':'Langue des équivalents','Gloss & speech language':'Langue des équivalents et de la voix','Show native-language word glosses':'Afficher les équivalents dans ma langue','Target-language speech':'Voix dans la langue cible','English voice':'Voix anglaise','Dark theme':'Thème sombre','Light theme':'Thème clair','Answer sounds: off':'Sons : désactivés','Answer sounds: on':'Sons : activés','Choose level':'Choisir un niveau','Level:':'Niveau :','How comfortable are you with English?':'Quel est votre niveau de confort en anglais ?','This is not a test.':'Ce n’est pas un test.','Beginner':'Débutant','Intermediate':'Intermédiaire','Advanced':'Avancé','Not sure yet':'Je ne sais pas encore','Home & friends':'Maison et amis','What would you like to practice?':'Que souhaitez-vous pratiquer ?','Choose a practice type':'Choisissez un type de pratique','Words you saved.':'Mots enregistrés.','Words to revisit.':'Mots à revoir.','Search by word, meaning, or example':'Chercher un mot, un sens ou un exemple','For example: calm, fair, or a phrase':'Exemple : calme, juste ou une expression','Clear search':'Effacer la recherche','No matching words.':'Aucun mot correspondant.','No saved words yet.':'Aucun mot enregistré pour le moment.','No words are due yet.':'Aucun mot à réviser pour le moment.','Review as flashcards':'Réviser avec des cartes','Flip card':'Retourner la carte','Reveal the word':'Afficher le mot','Rate your recall':'Évaluez votre rappel','Easy':'Facile','Medium':'Moyen','Hard':'Difficile','Leave this trail':'Quitter ce parcours','Back to home':'Retour à l’accueil','Back home':'Retour à l’accueil','Next scene':'Scène suivante','Next turn':'Tour suivant','Next situation':'Situation suivante','See your results':'Voir vos résultats','That fits the moment.':'Ce mot convient ici.','A closer fit is':'Un choix plus précis serait','A small clue:':'Petit indice :','Context is your clue':'Le contexte vous guide','No timer. Take a moment and choose with care.':'Pas de chronomètre. Prenez le temps de choisir.','No timer. Stop whenever you need.':'Pas de chronomètre. Arrêtez quand vous le souhaitez.','Nice fit.':'Bon choix.','Try noticing the goal.':'Repérez l’objectif.','A thoughtful fit.':'Un choix réfléchi.','Near-synonyms:':'Synonymes proches :','Opposites:':'Contraires :','The nuance:':'La nuance :','Gloss':'Équivalent','Listen':'Écouter','Tone Shift':'Changer de ton','Review words':'Réviser les mots','YOUR WORD COLLECTION':'VOTRE COLLECTION DE MOTS','Keep your progress portable':'Emportez votre progression','Download backup':'Télécharger une sauvegarde','Restore backup':'Restaurer une sauvegarde','Word review':'Révision du vocabulaire','Round complete.':'Parcours terminé.','No timer.':'Sans chronomètre.','Recall the word':'Rappelez-vous le mot','Choose how well you remembered it.':'Évaluez votre rappel.','Tomorrow':'Demain','In 3 days':'Dans 3 jours','In 7 days':'Dans 7 jours','Flashcard progress':'Progression des cartes'
      },
      hi: {
        'Skip to main content':'मुख्य सामग्री पर जाएँ','Your space':'आपकी जगह','YOUR STREAK':'आपकी अभ्यास-श्रृंखला','days':'दिन','Home':'होम','Practice':'अभ्यास','Explore worlds':'दुनिया देखें','Nuance lab':'अर्थ के अंतर','My wordbook':'मेरी शब्द-पुस्तिका','Words':'शब्द','Worlds':'दुनिया','Settings':'सेटिंग्स','Interface language':'इंटरफ़ेस की भाषा','Gloss language':'शब्दार्थ की भाषा','Gloss & speech language':'शब्दार्थ और आवाज़ की भाषा','Show native-language word glosses':'अपनी भाषा में शब्दार्थ दिखाएँ','Target-language speech':'लक्ष्य भाषा में उच्चारण','English voice':'अंग्रेज़ी आवाज़','Dark theme':'डार्क थीम','Light theme':'लाइट थीम','Answer sounds: off':'उत्तर ध्वनि: बंद','Answer sounds: on':'उत्तर ध्वनि: चालू','Choose level':'स्तर चुनें','Level:':'स्तर:','How comfortable are you with English?':'आप अंग्रेज़ी में कितने सहज हैं?','This is not a test.':'यह परीक्षा नहीं है।','Beginner':'शुरुआती','Intermediate':'मध्यम','Advanced':'उन्नत','Not sure yet':'अभी निश्चित नहीं','Home & friends':'घर और दोस्त','What would you like to practice?':'आप किसका अभ्यास करना चाहेंगे?','Choose a practice type':'अभ्यास का प्रकार चुनें','Words you saved.':'आपके सहेजे हुए शब्द।','Words to revisit.':'दोहराने वाले शब्द।','Search by word, meaning, or example':'शब्द, अर्थ या उदाहरण खोजें','For example: calm, fair, or a phrase':'जैसे: शांत, उचित या कोई वाक्यांश','Clear search':'खोज मिटाएँ','No matching words.':'कोई मेल खाता शब्द नहीं।','No saved words yet.':'अभी कोई शब्द सहेजा नहीं गया।','No words are due yet.':'अभी कोई शब्द दोहराने के लिए नहीं है।','Review as flashcards':'फ्लैशकार्ड से दोहराएँ','Flip card':'कार्ड पलटें','Reveal the word':'शब्द दिखाएँ','Rate your recall':'अपनी याद का आकलन करें','Easy':'आसान','Medium':'मध्यम','Hard':'कठिन','Leave this trail':'इस अभ्यास से बाहर जाएँ','Back to home':'होम पर लौटें','Back home':'होम पर लौटें','Next scene':'अगला दृश्य','Next turn':'अगली बारी','Next situation':'अगली परिस्थिति','See your results':'परिणाम देखें','That fits the moment.':'यह शब्द यहाँ सही बैठता है।','A closer fit is':'यह शब्द अधिक उपयुक्त है','A small clue:':'एक छोटा संकेत:','Context is your clue':'संदर्भ आपका संकेत है','No timer. Take a moment and choose with care.':'कोई समय-सीमा नहीं। सोचकर चुनें।','No timer. Stop whenever you need.':'कोई समय-सीमा नहीं। जब चाहें रुकें।','Nice fit.':'अच्छा चुनाव।','Try noticing the goal.':'उद्देश्य पर ध्यान दें।','A thoughtful fit.':'सोच-समझकर चुना।','Near-synonyms:':'मिलते-जुलते शब्द:','Opposites:':'विलोम:','The nuance:':'अर्थ का सूक्ष्म अंतर:','Gloss':'शब्दार्थ','Listen':'सुनें','Tone Shift':'बात का लहजा','Review words':'शब्द दोहराएँ','YOUR WORD COLLECTION':'आपके शब्द','Keep your progress portable':'अपनी प्रगति साथ रखें','Download backup':'बैकअप डाउनलोड करें','Restore backup':'बैकअप बहाल करें','Word review':'शब्द दोहराव','Round complete.':'राउंड पूरा हुआ।','No timer.':'बिना समय-सीमा।','Recall the word':'शब्द याद करें','Choose how well you remembered it.':'आपको कितना याद रहा, चुनें।','Tomorrow':'कल','In 3 days':'3 दिनों में','In 7 days':'7 दिनों में','Flashcard progress':'फ्लैशकार्ड प्रगति'
      },
      bn: {
        'Skip to main content':'মূল অংশে যান','Your space':'আপনার জায়গা','YOUR STREAK':'আপনার অনুশীলনের ধারা','days':'দিন','Home':'হোম','Practice':'অনুশীলন','Explore worlds':'জগৎ ঘুরে দেখুন','Nuance lab':'অর্থের সূক্ষ্মতা','My wordbook':'আমার শব্দভান্ডার','Words':'শব্দ','Worlds':'জগৎ','Settings':'সেটিংস','Interface language':'ইন্টারফেসের ভাষা','Gloss language':'শব্দার্থের ভাষা','Gloss & speech language':'শব্দার্থ ও কণ্ঠের ভাষা','Show native-language word glosses':'নিজের ভাষায় শব্দার্থ দেখান','Target-language speech':'লক্ষ্য ভাষার উচ্চারণ','English voice':'ইংরেজি কণ্ঠ','Dark theme':'ডার্ক থিম','Light theme':'লাইট থিম','Answer sounds: off':'উত্তরের শব্দ: বন্ধ','Answer sounds: on':'উত্তরের শব্দ: চালু','Choose level':'স্তর বেছে নিন','Level:':'স্তর:','How comfortable are you with English?':'ইংরেজিতে আপনি কতটা স্বচ্ছন্দ?','This is not a test.':'এটি কোনো পরীক্ষা নয়।','Beginner':'শুরুর স্তর','Intermediate':'মধ্যম','Advanced':'উন্নত','Not sure yet':'এখনও নিশ্চিত নই','Home & friends':'বাড়ি ও বন্ধুরা','What would you like to practice?':'আপনি কী অনুশীলন করতে চান?','Choose a practice type':'অনুশীলনের ধরন বেছে নিন','Words you saved.':'আপনার সংরক্ষিত শব্দ।','Words to revisit.':'আবার দেখার শব্দ।','Search by word, meaning, or example':'শব্দ, অর্থ বা উদাহরণ খুঁজুন','For example: calm, fair, or a phrase':'যেমন: শান্ত, ন্যায্য, বা কোনো বাক্যাংশ','Clear search':'অনুসন্ধান মুছুন','No matching words.':'মিল থাকা কোনো শব্দ নেই।','No saved words yet.':'এখনও কোনো শব্দ সংরক্ষিত নেই।','No words are due yet.':'এখনও পুনরাবৃত্তির জন্য কোনো শব্দ নেই।','Review as flashcards':'ফ্ল্যাশকার্ডে অনুশীলন','Flip card':'কার্ড উল্টান','Reveal the word':'শব্দটি দেখুন','Rate your recall':'মনে থাকার মাত্রা বেছে নিন','Easy':'সহজ','Medium':'মাঝারি','Hard':'কঠিন','Leave this trail':'এই অনুশীলন থেকে বের হন','Back to home':'হোমে ফিরুন','Back home':'হোমে ফিরুন','Next scene':'পরের দৃশ্য','Next turn':'পরের ধাপ','Next situation':'পরের পরিস্থিতি','See your results':'ফলাফল দেখুন','That fits the moment.':'এই শব্দটি এখানে মানানসই।','A closer fit is':'আরও মানানসই শব্দ','A small clue:':'একটি ছোট ইঙ্গিত:','Context is your clue':'প্রসঙ্গই আপনার ইঙ্গিত','No timer. Take a moment and choose with care.':'সময় ধরা নেই। ভেবে-চিন্তে বেছে নিন।','No timer. Stop whenever you need.':'সময় ধরা নেই। যখন দরকার থামুন।','Nice fit.':'ভালো মিল।','Try noticing the goal.':'উদ্দেশ্যটি খেয়াল করুন।','A thoughtful fit.':'ভেবেচিন্তে ভালো নির্বাচন।','Near-synonyms:':'কাছাকাছি অর্থের শব্দ:','Opposites:':'বিপরীত শব্দ:','The nuance:':'সূক্ষ্ম অর্থের পার্থক্য:','Gloss':'শব্দার্থ','Listen':'শুনুন','Tone Shift':'কথার ভঙ্গি','Review words':'শব্দ ঝালাই','YOUR WORD COLLECTION':'আপনার শব্দের সংগ্রহ','Keep your progress portable':'আপনার অগ্রগতি সঙ্গে রাখুন','Download backup':'ব্যাকআপ ডাউনলোড','Restore backup':'ব্যাকআপ ফিরিয়ে আনুন','Word review':'শব্দ পুনরাবৃত্তি','Round complete.':'রাউন্ড শেষ।','No timer.':'সময় ধরা নেই।','Recall the word':'শব্দটি মনে করুন','Choose how well you remembered it.':'কতটা মনে ছিল তা বেছে নিন।','Tomorrow':'আগামীকাল','In 3 days':'৩ দিন পর','In 7 days':'৭ দিন পর','Flashcard progress':'ফ্ল্যাশকার্ডের অগ্রগতি'
      }
    };
    const UI_EXTRA = {
      es: {
        'Read the scene, notice the clue, and pick the option that says exactly what you mean.':'Lee la escena, fíjate en la pista y elige la opción que exprese exactamente lo que quieres decir.',
        'What’s the best word for this moment?':'¿Qué palabra encaja mejor en este momento?',
        'Which word best completes this scene?':'¿Qué palabra completa mejor esta escena?',
        'CHOOSE THE WORD THAT FITS BEST':'ELIGE LA PALABRA QUE MEJOR ENCAJA',
        'Context is your clue':'El contexto es tu pista',
        'You found a good fit on':'Encontraste una buena opción en',
        'Type the missing word.':'Escribe la palabra que falta.',
        'Type the missing word':'Escribe la palabra que falta',
        'Check answer':'Comprobar respuesta','Show a clue':'Mostrar una pista','Hide clue':'Ocultar pista',
        'What you practiced':'Lo que practicaste','What would you like to practice?':'¿Qué te gustaría practicar?',
        'Search by word, meaning, or example':'Buscar por palabra, significado o ejemplo',
        'Words explored':'Palabras exploradas','Practice streak':'Racha de práctica','Daily mix':'Mezcla diaria',
        'Start a short round':'Empezar una ronda breve','Choose another game':'Elegir otro juego','ROUND COMPLETE':'RONDA COMPLETADA',
        'YOUR WORD COLLECTION':'TU COLECCIÓN DE PALABRAS','Save this word':'Guardar esta palabra','Save to wordbook':'Guardar en mi vocabulario',
        'Play the word':'Escuchar la palabra','Play slowly':'Escuchar despacio','A clue:':'Una pista:',
        'Keep my current level and return home':'Conservar mi nivel y volver al inicio','Change your starting level':'Cambiar el nivel inicial',
        'All caught up.':'¡Todo al día!','Saved words resurface here when their review date arrives.':'Los términos guardados volverán cuando llegue su fecha de repaso.',
        'Your ratings set when each word returns.':'Tus valoraciones determinan cuándo vuelve cada palabra.'
      },
      fr: {
        'Read the scene, notice the clue, and pick the option that says exactly what you mean.':'Lisez la scène, repérez l’indice et choisissez le mot qui exprime exactement votre idée.',
        'What’s the best word for this moment?':'Quel mot convient le mieux à cette situation ?',
        'Which word best completes this scene?':'Quel mot complète le mieux cette scène ?',
        'CHOOSE THE WORD THAT FITS BEST':'CHOISISSEZ LE MOT LE PLUS ADAPTÉ',
        'You found a good fit on':'Vous avez trouvé une bonne réponse sur',
        'Type the missing word.':'Saisissez le mot manquant.','Type the missing word':'Saisissez le mot manquant',
        'Check answer':'Vérifier','Show a clue':'Afficher un indice','Hide clue':'Masquer l’indice',
        'What you practiced':'Ce que vous avez travaillé','Words explored':'Mots découverts','Practice streak':'Série de pratique',
        'Daily mix':'Mélange du jour','Start a short round':'Lancer une courte manche','Choose another game':'Choisir un autre jeu',
        'ROUND COMPLETE':'PARCOURS TERMINÉ','Save this word':'Enregistrer ce mot','Save to wordbook':'Ajouter au vocabulaire',
        'Play the word':'Écouter le mot','Play slowly':'Écouter lentement','A clue:':'Indice :',
        'Keep my current level and return home':'Garder mon niveau et revenir à l’accueil','Change your starting level':'Changer de niveau',
        'All caught up.':'Tout est à jour !','Saved words resurface here when their review date arrives.':'Les mots enregistrés reviendront à leur date de révision.',
        'Your ratings set when each word returns.':'Vos évaluations déterminent le prochain rappel.'
      },
      hi: {
        'Read the scene, notice the clue, and pick the option that says exactly what you mean.':'दृश्य पढ़ें, संकेत पहचानें और वही विकल्प चुनें जो आपका अर्थ सही बताए।',
        'What’s the best word for this moment?':'इस पल के लिए कौन-सा शब्द सबसे उपयुक्त है?',
        'Which word best completes this scene?':'इस दृश्य को कौन-सा शब्द सबसे अच्छी तरह पूरा करता है?',
        'CHOOSE THE WORD THAT FITS BEST':'सबसे उपयुक्त शब्द चुनें',
        'You found a good fit on':'आपने सही शब्द चुना',
        'Type the missing word.':'छूटा हुआ शब्द लिखें।','Type the missing word':'छूटा हुआ शब्द लिखें',
        'Check answer':'उत्तर जाँचें','Show a clue':'संकेत दिखाएँ','Hide clue':'संकेत छिपाएँ',
        'What you practiced':'आपने क्या अभ्यास किया','Words explored':'देखे गए शब्द','Practice streak':'अभ्यास की लगातार श्रृंखला',
        'Daily mix':'आज का मिश्रित अभ्यास','Start a short round':'छोटा अभ्यास शुरू करें','Choose another game':'दूसरा खेल चुनें',
        'ROUND COMPLETE':'अभ्यास पूरा','Save this word':'यह शब्द सहेजें','Save to wordbook':'शब्द-पुस्तिका में सहेजें',
        'Play the word':'शब्द सुनें','Play slowly':'धीरे सुनें','A clue:':'संकेत:',
        'Keep my current level and return home':'मेरा स्तर रखें और होम लौटें','Change your starting level':'शुरुआती स्तर बदलें',
        'All caught up.':'अभी सब पूरा है।','Saved words resurface here when their review date arrives.':'सहेजे शब्द अगली समीक्षा तिथि पर फिर दिखेंगे।',
        'Your ratings set when each word returns.':'आपका मूल्यांकन तय करता है कि शब्द कब फिर आएगा।'
      },
      bn: {
        'Read the scene, notice the clue, and pick the option that says exactly what you mean.':'দৃশ্যটি পড়ুন, ইঙ্গিতটি বুঝুন এবং আপনার অর্থটি ঠিকভাবে প্রকাশ করে এমন শব্দ বেছে নিন।',
        'What’s the best word for this moment?':'এই মুহূর্তে কোন শব্দটি সবচেয়ে মানানসই?',
        'Which word best completes this scene?':'এই দৃশ্যটি কোন শব্দে সবচেয়ে ভালোভাবে সম্পূর্ণ হয়?',
        'CHOOSE THE WORD THAT FITS BEST':'সবচেয়ে মানানসই শব্দটি বেছে নিন',
        'You found a good fit on':'আপনি মানানসই উত্তর দিয়েছেন',
        'Type the missing word.':'ফাঁকা জায়গার শব্দটি লিখুন।','Type the missing word':'ফাঁকা শব্দটি লিখুন',
        'Check answer':'উত্তর যাচাই','Show a clue':'ইঙ্গিত দেখান','Hide clue':'ইঙ্গিত লুকান',
        'What you practiced':'আপনি যা অনুশীলন করেছেন','Words explored':'দেখা শব্দ','Practice streak':'অনুশীলনের ধারাবাহিকতা',
        'Daily mix':'আজকের মিশ্র অনুশীলন','Start a short round':'ছোট রাউন্ড শুরু','Choose another game':'অন্য খেলা বেছে নিন',
        'ROUND COMPLETE':'রাউন্ড শেষ','Save this word':'শব্দটি সংরক্ষণ করুন','Save to wordbook':'শব্দভান্ডারে রাখুন',
        'Play the word':'শব্দটি শুনুন','Play slowly':'ধীরে শুনুন','A clue:':'ইঙ্গিত:',
        'Keep my current level and return home':'বর্তমান স্তর রেখে হোমে ফিরুন','Change your starting level':'শুরুর স্তর বদলান',
        'All caught up.':'সব অনুশীলন শেষ!','Saved words resurface here when their review date arrives.':'পুনরাবৃত্তির তারিখ এলে সংরক্ষিত শব্দ আবার দেখাবে।',
        'Your ratings set when each word returns.':'আপনার মূল্যায়ন ঠিক করবে শব্দটি কখন আবার আসবে।'
      }
    };
    const UI_EXTRA_PAGES = {
      es: {
        'English for everyday moments.':'Inglés para momentos cotidianos.','Learn common words through short situations, and see when similar words do not quite fit.':'Aprende palabras comunes con situaciones breves y descubre cuándo otras parecidas no encajan del todo.',
        'YOUR NEXT SHORT ROUND':'TU PRÓXIMA RONDA BREVE','ROUND IN PROGRESS':'RONDA EN CURSO','Continue when you’re ready.':'Continúa cuando quieras.','Continue this round':'Continuar esta ronda','Start a 5-question lesson':'Empezar una lección de 5 preguntas','Choose a different activity':'Elegir otra actividad',
        'Words explored':'Palabras exploradas','Answer accuracy':'Precisión de respuestas','Want to focus on a skill?':'¿Quieres centrarte en una habilidad?','Choose a practice type →':'Elegir tipo de práctica →',
        'PRACTICE · NO TIMER':'PRÁCTICA · SIN RELOJ','Each activity has one clear goal. Choose a short round; you can switch activities whenever you like.':'Cada actividad tiene un objetivo claro. Elige una ronda breve y cambia cuando quieras.',
        'NOT SURE? START WITH THIS':'¿NO SABES? EMPIEZA AQUÍ','Try four different skills.':'Prueba cuatro habilidades.','One scene, one similar word, one opposite, and one everyday phrase. A quick way to see what each activity feels like.':'Una escena, un sinónimo, un antónimo y una frase cotidiana. Así conocerás cada actividad.',
        'Words and phrases':'Palabras y frases','Choose a word goal before you start.':'Elige qué quieres practicar.','Listen, read, and recall':'Escucha, lee y recuerda','Choose your setting':'Elige el entorno','Practice words in five settings.':'Practica palabras en cinco entornos.','Compare similar words.':'Compara palabras parecidas.','WORD GROUPS':'GRUPOS DE PALABRAS','A CLOSER LOOK':'MÁS DE CERCA',
        'YOUR TRAIL':'TU RECORRIDO','right so far in this round':'aciertos en esta ronda','Read a scene':'Lee una escena','Choose a word':'Elige una palabra','See why it fits':'Descubre por qué encaja',
        'Backup ready to restore':'Copia lista para restaurar','Replace with this backup':'Reemplazar con esta copia','Cancel':'Cancelar','Restore replaces current progress':'Restaurar reemplaza el progreso actual',
        'Your streak is a record, not a requirement.':'Tu racha es un registro, no una obligación.','A missed day never removes words or progress.':'Perder un día no borra palabras ni progreso.'
      },
      fr: {
        'English for everyday moments.':'L’anglais au quotidien.','Learn common words through short situations, and see when similar words do not quite fit.':'Apprenez des mots courants avec de courtes scènes et repérez les nuances entre mots proches.',
        'YOUR NEXT SHORT ROUND':'VOTRE PROCHAIN PARCOURS','ROUND IN PROGRESS':'PARCOURS EN COURS','Continue when you’re ready.':'Reprenez quand vous le souhaitez.','Continue this round':'Continuer ce parcours','Start a 5-question lesson':'Commencer une leçon de 5 questions','Choose a different activity':'Choisir une autre activité',
        'Words explored':'Mots découverts','Answer accuracy':'Précision des réponses','Want to focus on a skill?':'Envie de travailler une compétence ?','Choose a practice type →':'Choisir une activité →',
        'PRACTICE · NO TIMER':'PRATIQUE · SANS CHRONO','Each activity has one clear goal. Choose a short round; you can switch activities whenever you like.':'Chaque activité a un objectif clair. Choisissez un parcours court et changez quand vous voulez.',
        'NOT SURE? START WITH THIS':'INDÉCIS ? COMMENCEZ ICI','Try four different skills.':'Essayez quatre compétences.','One scene, one similar word, one opposite, and one everyday phrase. A quick way to see what each activity feels like.':'Une scène, un synonyme, un contraire et une expression courante pour découvrir les activités.',
        'Words and phrases':'Mots et expressions','Choose a word goal before you start.':'Choisissez un objectif avant de commencer.','Listen, read, and recall':'Écouter, lire et retrouver','Choose your setting':'Choisissez un contexte','Practice words in five settings.':'Pratiquez dans cinq contextes.','Compare similar words.':'Comparez des mots proches.','WORD GROUPS':'GROUPES DE MOTS','A CLOSER LOOK':'ZOOM SUR LES NUANCES',
        'YOUR TRAIL':'VOTRE PARCOURS','right so far in this round':'bonnes réponses dans ce parcours','Read a scene':'Lire une scène','Choose a word':'Choisir un mot','See why it fits':'Comprendre le choix',
        'Backup ready to restore':'Sauvegarde prête','Replace with this backup':'Remplacer par cette sauvegarde','Cancel':'Annuler',
        'Your streak is a record, not a requirement.':'Votre série est un repère, pas une obligation.','A missed day never removes words or progress.':'Un jour de pause ne supprime aucun mot ni progrès.'
      },
      hi: {
        'English for everyday moments.':'रोज़मर्रा के पलों के लिए अंग्रेज़ी।','Learn common words through short situations, and see when similar words do not quite fit.':'छोटी परिस्थितियों में आम शब्द सीखें और मिलते-जुलते शब्दों का अंतर समझें।',
        'YOUR NEXT SHORT ROUND':'आपका अगला छोटा अभ्यास','ROUND IN PROGRESS':'अभ्यास जारी है','Continue when you’re ready.':'जब चाहें फिर शुरू करें।','Continue this round':'यह राउंड जारी रखें','Start a 5-question lesson':'5 सवालों का पाठ शुरू करें','Choose a different activity':'दूसरी गतिविधि चुनें',
        'Words explored':'देखे गए शब्द','Answer accuracy':'उत्तर की सटीकता','Want to focus on a skill?':'किसी कौशल पर ध्यान देना चाहेंगे?','Choose a practice type →':'अभ्यास चुनें →',
        'PRACTICE · NO TIMER':'अभ्यास · समय-सीमा नहीं','Each activity has one clear goal. Choose a short round; you can switch activities whenever you like.':'हर गतिविधि का एक लक्ष्य है। छोटा राउंड चुनें और जब चाहें बदलें।',
        'NOT SURE? START WITH THIS':'निश्चित नहीं? यहाँ से शुरू करें','Try four different skills.':'चार कौशल आज़माएँ।','One scene, one similar word, one opposite, and one everyday phrase. A quick way to see what each activity feels like.':'एक दृश्य, समानार्थी, विलोम और रोज़मर्रा का वाक्यांश—चारों का छोटा परिचय।',
        'Words and phrases':'शब्द और वाक्यांश','Choose a word goal before you start.':'शुरू करने से पहले लक्ष्य चुनें।','Listen, read, and recall':'सुनें, पढ़ें और याद करें','Choose your setting':'अपना परिवेश चुनें','Practice words in five settings.':'पाँच परिवेशों में शब्दों का अभ्यास करें।','Compare similar words.':'मिलते-जुलते शब्दों की तुलना करें।','WORD GROUPS':'शब्द समूह','A CLOSER LOOK':'थोड़ा और समझें',
        'YOUR TRAIL':'आपका अभ्यास','right so far in this round':'इस राउंड में सही','Read a scene':'दृश्य पढ़ें','Choose a word':'शब्द चुनें','See why it fits':'जानें यह क्यों सही है',
        'Backup ready to restore':'बैकअप तैयार है','Replace with this backup':'इस बैकअप से बदलें','Cancel':'रद्द करें',
        'Your streak is a record, not a requirement.':'आपकी श्रृंखला केवल रिकॉर्ड है, ज़रूरी लक्ष्य नहीं।','A missed day never removes words or progress.':'एक दिन छूटने से शब्द या प्रगति नहीं मिटती।'
      },
      bn: {
        'English for everyday moments.':'প্রতিদিনের মুহূর্তের জন্য ইংরেজি।','Learn common words through short situations, and see when similar words do not quite fit.':'ছোট পরিস্থিতিতে প্রচলিত শব্দ শিখুন এবং কাছাকাছি শব্দের পার্থক্য বুঝুন।',
        'YOUR NEXT SHORT ROUND':'আপনার পরের ছোট রাউন্ড','ROUND IN PROGRESS':'রাউন্ড চলছে','Continue when you’re ready.':'যখন প্রস্তুত, আবার শুরু করুন।','Continue this round':'এই রাউন্ড চালিয়ে যান','Start a 5-question lesson':'৫টি প্রশ্নের পাঠ শুরু','Choose a different activity':'অন্য কার্যক্রম বেছে নিন',
        'Words explored':'দেখা শব্দ','Answer accuracy':'উত্তরের নির্ভুলতা','Want to focus on a skill?':'কোনো দক্ষতায় মন দিতে চান?','Choose a practice type →':'অনুশীলন বেছে নিন →',
        'PRACTICE · NO TIMER':'অনুশীলন · সময়ের চাপ নেই','Each activity has one clear goal. Choose a short round; you can switch activities whenever you like.':'প্রতিটি কার্যক্রমের একটি লক্ষ্য আছে। ছোট রাউন্ড নিন, চাইলে বদলান।',
        'NOT SURE? START WITH THIS':'নিশ্চিত নন? এখান থেকে শুরু','Try four different skills.':'চারটি দক্ষতা চেষ্টা করুন।','One scene, one similar word, one opposite, and one everyday phrase. A quick way to see what each activity feels like.':'একটি দৃশ্য, সমার্থক, বিপরীত ও দৈনন্দিন বাক্যাংশ—চার ধরনের অনুশীলন।',
        'Words and phrases':'শব্দ ও বাক্যাংশ','Choose a word goal before you start.':'শুরুর আগে অনুশীলনের লক্ষ্য বেছে নিন।','Listen, read, and recall':'শুনুন, পড়ুন ও মনে করুন','Choose your setting':'পরিবেশ বেছে নিন','Practice words in five settings.':'পাঁচটি পরিবেশে শব্দ অনুশীলন করুন।','Compare similar words.':'কাছাকাছি শব্দের তুলনা করুন।','WORD GROUPS':'শব্দের দল','A CLOSER LOOK':'আরও কাছ থেকে দেখুন',
        'YOUR TRAIL':'আপনার অনুশীলন','right so far in this round':'এই রাউন্ডে সঠিক','Read a scene':'দৃশ্য পড়ুন','Choose a word':'শব্দ বেছে নিন','See why it fits':'কেন মানায় দেখুন',
        'Backup ready to restore':'ব্যাকআপ প্রস্তুত','Replace with this backup':'এই ব্যাকআপ দিয়ে বদলান','Cancel':'বাতিল',
        'Your streak is a record, not a requirement.':'অনুশীলনের ধারা একটি রেকর্ড, বাধ্যবাধকতা নয়।','A missed day never removes words or progress.':'একদিন বিরতি নিলে শব্দ বা অগ্রগতি মুছে যায় না।'
      }
    };
    for (const language of Object.keys(UI_EXTRA_PAGES)) Object.assign(UI_TRANSLATIONS[language], UI_EXTRA_PAGES[language]);
    for (const language of Object.keys(UI_EXTRA)) Object.assign(UI_TRANSLATIONS[language], UI_EXTRA[language]);
    const UI_ONBOARDING_COPY = {
      es: {
        'STEP 1 OF 2 · SUPPORT LANGUAGE':'PASO 1 DE 2 · IDIOMA DE APOYO','STEP 2 OF 2 · ENGLISH LEVEL':'PASO 2 DE 2 · NIVEL DE INGLÉS','Support language':'Idioma de apoyo','English level':'Nivel de inglés','Setup progress':'Progreso de configuración',
        'Which language would you like to use?':'¿Qué idioma prefieres usar?','Choose one support language. It sets the app instructions and the language for optional word meanings. English practice stays in English.':'Elige un idioma de apoyo. Se usará en las instrucciones de la aplicación y para los significados opcionales. La práctica de inglés seguirá en inglés.','Show translated word hints':'Mostrar ayudas traducidas','Optional: show short meanings for English words in this language. Change this anytime in Settings.':'Opcional: muestra significados breves de palabras en inglés en este idioma. Puedes cambiarlo en Ajustes más adelante.','Choose a support language to set the language for word hints.':'Elige un idioma de apoyo para definir el idioma de las ayudas de palabras.','English selected. App instructions and word hints will stay in English.':'Has elegido inglés. Las instrucciones y las ayudas estarán en inglés.','Continue to English level':'Continuar al nivel de inglés','You can change your support language anytime in Settings.':'Puedes cambiar el idioma de apoyo cuando quieras en Ajustes.',
        'How comfortable are you with English?':'¿Qué tan cómodo te sientes con el inglés?','Choose the description that feels closest. This is not a test. Pick what sounds right today; you can change this later.':'Elige la descripción que más se acerque a tu nivel. No es un examen. Escoge lo que mejor te describa hoy; puedes cambiarlo después.','I’m new to English':'Estoy empezando con el inglés','I know a few words and want clear clues and familiar situations.':'Conozco algunas palabras y quiero pistas claras y situaciones familiares.','I know the basics':'Conozco lo básico','I can manage familiar conversations and want more natural word choices.':'Puedo mantener conversaciones cotidianas y quiero elegir palabras más naturales.','I’m comfortable in English':'Me siento cómodo/a con el inglés','I want to work on nuance, precision, and less common useful words.':'Quiero mejorar los matices, la precisión y aprender palabras útiles menos comunes.','I’m not sure':'No estoy seguro/a','Start with everyday words. You can change your level whenever you like.':'Empecemos con palabras cotidianas. Puedes cambiar de nivel cuando quieras.','Your support language':'Tu idioma de apoyo','Change support language':'Cambiar el idioma de apoyo','Your level only guides the first words and round. It is not a score.':'Tu nivel solo orienta las primeras palabras y la ronda. No es una puntuación.','Start my first lesson':'Empezar mi primera lección','Keep my current level and return home':'Conservar mi nivel y volver al inicio',
        'App language':'Idioma de la aplicación','App instructions and controls':'Instrucciones y controles de la aplicación','Word hints & pronunciation':'Ayudas de palabras y pronunciación','Language for optional word meanings and their speech':'Idioma para los significados opcionales y su pronunciación','Show optional word meanings':'Mostrar significados opcionales','English (no extra word meanings)':'Inglés (sin significados adicionales)'
      },
      fr: {
        'STEP 1 OF 2 · SUPPORT LANGUAGE':'ÉTAPE 1 SUR 2 · LANGUE D’AIDE','STEP 2 OF 2 · ENGLISH LEVEL':'ÉTAPE 2 SUR 2 · NIVEAU D’ANGLAIS','Support language':'Langue d’aide','English level':'Niveau d’anglais','Setup progress':'Progression de la configuration',
        'Which language would you like to use?':'Quelle langue souhaitez-vous utiliser ?','Choose one support language. It sets the app instructions and the language for optional word meanings. English practice stays in English.':'Choisissez une langue d’aide. Elle sera utilisée pour les instructions et les traductions facultatives. La pratique de l’anglais reste en anglais.','Show translated word hints':'Afficher les traductions des mots','Optional: show short meanings for English words in this language. Change this anytime in Settings.':'En option : afficher de courts équivalents des mots anglais dans cette langue. Vous pourrez changer ce choix dans les réglages.','Choose a support language to set the language for word hints.':'Choisissez une langue d’aide pour les équivalents des mots.','English selected. App instructions and word hints will stay in English.':'Anglais sélectionné. Les instructions et les aides resteront en anglais.','Continue to English level':'Continuer vers le niveau d’anglais','You can change your support language anytime in Settings.':'Vous pourrez changer la langue d’aide dans les réglages à tout moment.',
        'How comfortable are you with English?':'Quel est votre niveau de confort en anglais ?','Choose the description that feels closest. This is not a test. Pick what sounds right today; you can change this later.':'Choisissez la description qui vous correspond le mieux. Ce n’est pas un test. Votre choix peut changer plus tard.','I’m new to English':'Je débute en anglais','I know a few words and want clear clues and familiar situations.':'Je connais quelques mots et préfère des indices clairs et des situations familières.','I know the basics':'Je connais les bases','I can manage familiar conversations and want more natural word choices.':'Je peux tenir une conversation courante et choisir des mots plus naturels.','I’m comfortable in English':'Je suis à l’aise en anglais','I want to work on nuance, precision, and less common useful words.':'Je veux travailler les nuances, la précision et des mots utiles moins courants.','I’m not sure':'Je ne sais pas encore','Start with everyday words. You can change your level whenever you like.':'Commençons par des mots du quotidien. Vous pourrez changer de niveau à tout moment.','Your support language':'Votre langue d’aide','Change support language':'Changer la langue d’aide','Your level only guides the first words and round. It is not a score.':'Votre niveau sert uniquement à choisir les premiers mots et le premier parcours. Ce n’est pas une note.','Start my first lesson':'Commencer ma première leçon','Keep my current level and return home':'Garder mon niveau actuel et revenir à l’accueil',
        'App language':'Langue de l’application','App instructions and controls':'Instructions et commandes de l’application','Word hints & pronunciation':'Aide sur les mots et prononciation','Language for optional word meanings and their speech':'Langue des équivalents facultatifs et de leur prononciation','Show optional word meanings':'Afficher les équivalents facultatifs','English (no extra word meanings)':'Anglais (sans équivalents supplémentaires)'
      },
      hi: {
        'STEP 1 OF 2 · SUPPORT LANGUAGE':'चरण 1 / 2 · सहायता भाषा','STEP 2 OF 2 · ENGLISH LEVEL':'चरण 2 / 2 · अंग्रेज़ी का स्तर','Support language':'सहायता भाषा','English level':'अंग्रेज़ी का स्तर','Setup progress':'सेटअप की प्रगति',
        'Which language would you like to use?':'आप कौन-सी भाषा इस्तेमाल करना चाहेंगे?','Choose one support language. It sets the app instructions and the language for optional word meanings. English practice stays in English.':'अपनी सहायता भाषा चुनें। ऐप के निर्देश और वैकल्पिक शब्दार्थ इसी भाषा में दिखेंगे। अंग्रेज़ी का अभ्यास अंग्रेज़ी में ही रहेगा।','Show translated word hints':'शब्दों के अनुवादित अर्थ दिखाएँ','Optional: show short meanings for English words in this language. Change this anytime in Settings.':'वैकल्पिक: अंग्रेज़ी शब्दों के छोटे अर्थ इस भाषा में दिखाएँ। इसे सेटिंग्स में कभी भी बदल सकते हैं।','Choose a support language to set the language for word hints.':'शब्दार्थ की भाषा तय करने के लिए सहायता भाषा चुनें।','English selected. App instructions and word hints will stay in English.':'अंग्रेज़ी चुनी गई है। निर्देश और शब्दार्थ अंग्रेज़ी में ही रहेंगे।','Continue to English level':'अंग्रेज़ी का स्तर चुनें','You can change your support language anytime in Settings.':'सहायता भाषा सेटिंग्स में कभी भी बदली जा सकती है।',
        'How comfortable are you with English?':'आप अंग्रेज़ी में कितने सहज हैं?','Choose the description that feels closest. This is not a test. Pick what sounds right today; you can change this later.':'वह विवरण चुनें जो आपके सबसे करीब लगे। यह परीक्षा नहीं है। आप बाद में अपना चुनाव बदल सकते हैं।','I’m new to English':'मैं अंग्रेज़ी सीखना शुरू कर रहा/रही हूँ','I know a few words and want clear clues and familiar situations.':'मुझे कुछ शब्द आते हैं और मैं साफ़ संकेत व जानी-पहचानी परिस्थितियाँ चाहता/चाहती हूँ।','I know the basics':'मुझे बुनियादी अंग्रेज़ी आती है','I can manage familiar conversations and want more natural word choices.':'मैं रोज़मर्रा की बातचीत कर सकता/सकती हूँ और अधिक स्वाभाविक शब्द चुनना चाहता/चाहती हूँ।','I’m comfortable in English':'मैं अंग्रेज़ी में सहज हूँ','I want to work on nuance, precision, and less common useful words.':'मैं अर्थ के बारीक अंतर, सटीकता और कम आम उपयोगी शब्दों पर काम करना चाहता/चाहती हूँ।','I’m not sure':'अभी निश्चित नहीं','Start with everyday words. You can change your level whenever you like.':'रोज़मर्रा के शब्दों से शुरू करें। स्तर कभी भी बदल सकते हैं।','Your support language':'आपकी सहायता भाषा','Change support language':'सहायता भाषा बदलें','Your level only guides the first words and round. It is not a score.':'आपका स्तर सिर्फ़ शुरुआती शब्द और राउंड चुनने में मदद करता है। यह कोई अंक नहीं है।','Start my first lesson':'मेरा पहला पाठ शुरू करें','Keep my current level and return home':'मेरा मौजूदा स्तर रखें और होम पर लौटें',
        'App language':'ऐप की भाषा','App instructions and controls':'ऐप के निर्देश और नियंत्रण','Word hints & pronunciation':'शब्दार्थ और उच्चारण','Language for optional word meanings and their speech':'वैकल्पिक शब्दार्थ और उनके उच्चारण की भाषा','Show optional word meanings':'वैकल्पिक शब्दार्थ दिखाएँ','English (no extra word meanings)':'अंग्रेज़ी (अतिरिक्त शब्दार्थ नहीं)'
      },
      bn: {
        'STEP 1 OF 2 · SUPPORT LANGUAGE':'ধাপ ১ / ২ · সহায়তার ভাষা','STEP 2 OF 2 · ENGLISH LEVEL':'ধাপ ২ / ২ · ইংরেজির স্তর','Support language':'সহায়তার ভাষা','English level':'ইংরেজির স্তর','Setup progress':'সেটআপের অগ্রগতি',
        'Which language would you like to use?':'আপনি কোন ভাষাটি ব্যবহার করতে চান?','Choose one support language. It sets the app instructions and the language for optional word meanings. English practice stays in English.':'আপনার সহায়তার ভাষা বেছে নিন। অ্যাপের নির্দেশনা ও ঐচ্ছিক শব্দার্থ এই ভাষায় দেখানো হবে। ইংরেজি অনুশীলন ইংরেজিতেই থাকবে।','Show translated word hints':'অনূদিত শব্দার্থ দেখান','Optional: show short meanings for English words in this language. Change this anytime in Settings.':'ঐচ্ছিক: ইংরেজি শব্দের সংক্ষিপ্ত অর্থ এই ভাষায় দেখুন। সেটিংস থেকে পরে বদলাতে পারবেন।','Choose a support language to set the language for word hints.':'শব্দার্থের ভাষা ঠিক করতে সহায়তার ভাষা বেছে নিন।','English selected. App instructions and word hints will stay in English.':'ইংরেজি বেছে নেওয়া হয়েছে। নির্দেশনা ও শব্দার্থ ইংরেজিতেই থাকবে।','Continue to English level':'ইংরেজির স্তর বেছে নিন','You can change your support language anytime in Settings.':'সেটিংস থেকে যেকোনো সময় সহায়তার ভাষা বদলাতে পারবেন।',
        'How comfortable are you with English?':'ইংরেজিতে আপনি কতটা স্বচ্ছন্দ?','Choose the description that feels closest. This is not a test. Pick what sounds right today; you can change this later.':'যে বর্ণনাটি আপনার সঙ্গে সবচেয়ে মেলে সেটি বেছে নিন। এটি পরীক্ষা নয়; পরে চাইলে বদলাতে পারবেন।','I’m new to English':'আমি ইংরেজি শেখা শুরু করছি','I know a few words and want clear clues and familiar situations.':'কিছু শব্দ জানি; সহজ ইঙ্গিত ও পরিচিত পরিস্থিতিতে শিখতে চাই।','I know the basics':'ইংরেজির প্রাথমিক বিষয় জানি','I can manage familiar conversations and want more natural word choices.':'পরিচিত বিষয়ে কথা বলতে পারি, আরও স্বাভাবিক শব্দচয়ন শিখতে চাই।','I’m comfortable in English':'ইংরেজিতে আমি স্বচ্ছন্দ','I want to work on nuance, precision, and less common useful words.':'অর্থের সূক্ষ্মতা, নির্ভুলতা ও কম প্রচলিত দরকারি শব্দ শিখতে চাই।','I’m not sure':'এখনও নিশ্চিত নই','Start with everyday words. You can change your level whenever you like.':'দৈনন্দিন শব্দ দিয়ে শুরু করুন। স্তর যেকোনো সময় বদলাতে পারবেন।','Your support language':'আপনার সহায়তার ভাষা','Change support language':'সহায়তার ভাষা বদলান','Your level only guides the first words and round. It is not a score.':'আপনার স্তর শুধু শুরুর শব্দ ও রাউন্ড বেছে নিতে সাহায্য করে; এটি কোনো স্কোর নয়।','Start my first lesson':'আমার প্রথম পাঠ শুরু করুন','Keep my current level and return home':'বর্তমান স্তর রেখে হোমে ফিরুন',
        'App language':'অ্যাপের ভাষা','App instructions and controls':'অ্যাপের নির্দেশনা ও নিয়ন্ত্রণ','Word hints & pronunciation':'শব্দার্থ ও উচ্চারণ','Language for optional word meanings and their speech':'ঐচ্ছিক শব্দার্থ ও উচ্চারণের ভাষা','Show optional word meanings':'ঐচ্ছিক শব্দার্থ দেখান','English (no extra word meanings)':'ইংরেজি (অতিরিক্ত শব্দার্থ নেই)'
      }
    };
    for (const language of Object.keys(UI_ONBOARDING_COPY)) Object.assign(UI_TRANSLATIONS[language], UI_ONBOARDING_COPY[language]);
    const WORD_GLOSSES = {
      curious:{es:'curioso/a',fr:'curieux / curieuse',hi:'जिज्ञासु',bn:'কৌতূহলী'}, concise:{es:'conciso/a',fr:'concis / concise',hi:'संक्षिप्त',bn:'সংক্ষিপ্ত'}, puzzled:{es:'desconcertado/a',fr:'perplexe',hi:'उलझन में',bn:'বিভ্রান্ত'}, accurate:{es:'preciso/a',fr:'précis / exacte',hi:'सटीक',bn:'নির্ভুল'}, inspect:{es:'inspeccionar',fr:'inspecter',hi:'जाँच करना',bn:'পরীক্ষা করা'}, bustling:{es:'animado/a y concurrido/a',fr:'animé et très fréquenté',hi:'चहल-पहल वाला',bn:'ব্যস্ত ও সরগরম'}, reasonable:{es:'razonable',fr:'raisonnable',hi:'उचित',bn:'যুক্তিসংগত'}, ripe:{es:'maduro/a',fr:'mûr / mûre',hi:'पका हुआ',bn:'পাকা'}, composed:{es:'sereno/a',fr:'maître de soi',hi:'संयत',bn:'সংযত'}, practical:{es:'práctico/a',fr:'pratique',hi:'व्यावहारिक',bn:'ব্যবহারিক'}, diplomatic:{es:'diplomático/a',fr:'diplomate',hi:'कूटनीतिक',bn:'কৌশলী'}, reliable:{es:'confiable',fr:'fiable',hi:'भरोसेमंद',bn:'নির্ভরযোগ্য'}, cozy:{es:'acogedor/a',fr:'douillet / chaleureux',hi:'आरामदायक',bn:'আরামদায়ক'}, frugal:{es:'ahorrador/a',fr:'économe',hi:'मितव्ययी',bn:'মিতব্যয়ী'}, murmured:{es:'murmuró',fr:'murmura',hi:'धीरे से कहा',bn:'ফিসফিস করে বলল'}, sturdy:{es:'resistente',fr:'solide',hi:'मज़बूत',bn:'মজবুত'}, detour:{es:'desvío',fr:'détour',hi:'वैकल्पिक रास्ता',bn:'বিকল্প পথ'}, frequent:{es:'frecuente',fr:'fréquent',hi:'बार-बार होने वाला',bn:'ঘনঘন'}, hospitable:{es:'hospitalario/a',fr:'accueillant/e',hi:'मेहमाननवाज़',bn:'অতিথিপরায়ণ'}, serene:{es:'sereno/a',fr:'serein / sereine',hi:'शांत',bn:'শান্ত'}, helpful:{es:'servicial',fr:'serviable',hi:'मददगार',bn:'সহায়ক'}, clear:{es:'claro/a',fr:'clair / claire',hi:'स्पष्ट',bn:'স্পষ্ট'}, difficult:{es:'difícil',fr:'difficile',hi:'कठिन',bn:'কঠিন'}, confident:{es:'seguro/a de sí mismo/a',fr:'confiant/e',hi:'आत्मविश्वासी',bn:'আত্মবিশ্বাসী'}, quiet:{es:'tranquilo/a',fr:'calme',hi:'शांत',bn:'শান্ত'}, easy:{es:'fácil',fr:'facile',hi:'आसान',bn:'সহজ'}, affordable:{es:'asequible',fr:'abordable',hi:'किफ़ायती',bn:'সাশ্রয়ী'}, fresh:{es:'fresco/a',fr:'frais / fraîche',hi:'ताज़ा',bn:'তাজা'}, busy:{es:'ocupado/a',fr:'occupé/e',hi:'व्यस्त',bn:'ব্যস্ত'}, expensive:{es:'caro/a',fr:'cher / chère',hi:'महँगा',bn:'দামি'}, full:{es:'lleno/a',fr:'plein / pleine',hi:'भरा हुआ',bn:'ভরা'}, polite:{es:'educado/a',fr:'poli/e',hi:'विनम्र',bn:'ভদ্র'}, quick:{es:'rápido/a',fr:'rapide',hi:'तेज़',bn:'দ্রুত'}, honest:{es:'honesto/a',fr:'honnête',hi:'ईमानदार',bn:'সৎ'}, patient:{es:'paciente',fr:'patient/e',hi:'धैर्यवान',bn:'ধৈর্যশীল'}, organized:{es:'organizado/a',fr:'organisé/e',hi:'व्यवस्थित',bn:'গোছানো'}, available:{es:'disponible',fr:'disponible',hi:'उपलब्ध',bn:'উপলভ্য'}, urgent:{es:'urgente',fr:'urgent/e',hi:'तुरंत ज़रूरी',bn:'জরুরি'}, tired:{es:'cansado/a',fr:'fatigué/e',hi:'थका हुआ',bn:'ক্লান্ত'}, messy:{es:'desordenado/a',fr:'en désordre',hi:'अस्त-व्यस्त',bn:'এলোমেলো'}, comfortable:{es:'cómodo/a',fr:'confortable',hi:'आरामदायक',bn:'আরামদায়ক'}, kind:{es:'amable',fr:'gentil / gentille',hi:'दयालु',bn:'দয়ালু'}, happy:{es:'feliz',fr:'heureux / heureuse',hi:'खुश',bn:'খুশি'}, hot:{es:'caliente',fr:'chaud / chaude',hi:'गरम',bn:'গরম'}, early:{es:'temprano',fr:'tôt',hi:'जल्दी',bn:'আগে'}, safe:{es:'seguro/a',fr:'sûr / sûre',hi:'सुरक्षित',bn:'নিরাপদ'}, nearby:{es:'cercano/a',fr:'à proximité',hi:'पास में',bn:'কাছাকাছি'}, open:{es:'abierto/a',fr:'ouvert/e',hi:'खुला',bn:'খোলা'}, strong:{es:'fuerte',fr:'fort / forte',hi:'मज़बूत',bn:'শক্তিশালী'}, slow:{es:'lento/a',fr:'lent/e',hi:'धीमा',bn:'ধীর'}
    };

    const STARTER_PATHS = {
      beginner: { env: 'home', goal: 'familiar words, then describing a real situation', ids: ['tired', 'messy', 'comfortable', 'cozy'] },
      intermediate: { env: 'market', goal: 'prices, observation and precise choices', ids: ['affordable', 'reasonable', 'inspect', 'bustling'] },
      advanced: { env: 'workplace', goal: 'precision and tact under pressure', ids: ['reliable', 'practical', 'composed', 'diplomatic'] },
      unsure: { env: 'home', goal: 'familiar moments followed by richer descriptions', ids: ['kind', 'messy', 'comfortable', 'cozy'] }
    };
    // Explicit ordered pathways. Progress is inferred from explored IDs so older
    // local saves need no migration; due/missed words get priority within each step.
    const GUIDED_PATHS = {
      beginner: [
        { env: 'campus', ids: ['helpful', 'quiet', 'clear', 'confident', 'curious'] },
        { env: 'market', ids: ['fresh', 'polite', 'affordable', 'reasonable', 'inspect'] },
        { env: 'travel', ids: ['early', 'nearby', 'safe', 'frequent', 'detour'] }
      ],
      intermediate: [
        { env: 'campus', ids: ['confident', 'curious', 'puzzled', 'accurate', 'concise'] },
        { env: 'workplace', ids: ['available', 'organized', 'patient', 'reliable', 'composed'] },
        { env: 'travel', ids: ['nearby', 'frequent', 'detour', 'hospitable', 'serene'] }
      ],
      advanced: [
        { env: 'campus', ids: ['confident', 'curious', 'puzzled', 'accurate', 'concise'] },
        { env: 'market', ids: ['affordable', 'ripe', 'reasonable', 'inspect', 'bustling'] },
        { env: 'travel', ids: ['safe', 'frequent', 'detour', 'hospitable', 'serene'] }
      ],
      unsure: [
        { env: 'campus', ids: ['helpful', 'quiet', 'clear', 'confident', 'curious'] },
        { env: 'market', ids: ['fresh', 'polite', 'affordable', 'reasonable', 'inspect'] },
        { env: 'travel', ids: ['early', 'nearby', 'safe', 'frequent', 'detour'] }
      ]
    };
    // Within unplanned scene sessions, start accessible and build to a nuanced word.
    const SCENE_DIFFICULTY = {
      beginner: new Set(['tired','kind','happy','hot','early','easy','fresh','helpful','quiet','polite','nearby','safe','quick','open','full']),
      challenging: new Set(['cozy','sturdy','reasonable','inspect','curious','confident','reliable','accurate','puzzled','practical','composed','frequent','detour','hospitable','serene','concise','diplomatic','frugal','bustling','murmured'])
    };
    function sceneDifficulty(question) {
      return SCENE_DIFFICULTY.beginner.has(question.id) ? 1 : SCENE_DIFFICULTY.challenging.has(question.id) ? 3 : 2;
    }
    function orderSceneQuestions(questions) {
      // Stable tie order comes from rotation; only the difficulty ramp is fixed.
      return questions.slice().sort((a, b) => sceneDifficulty(a) - sceneDifficulty(b));
    }
    const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30];
    const DEFAULT_PROGRESS = { totalAnswered: 0, totalCorrect: 0, streak: 0, lastPlayed: null, practiceDates: [], gameRuns: {}, gameStats: {}, savedIds: [], missedIds: [], exploredIds: [], reviewSchedule: {}, masteryLevels: {}, wordNotes: {}, level: null, accent: 'en-US', uiLanguage: 'en', glossLanguage: 'es', showGloss: false, theme: 'light', soundEnabled: false };
    // Freeze curated content after assigning level bands; sessions clone choice arrays before shuffling.
    function deepFreeze(value, seen = new WeakSet()) {
      if (!value || typeof value !== 'object' || seen.has(value)) return value;
      seen.add(value);
      Object.freeze(value);
      Object.values(value).forEach(child => deepFreeze(child, seen));
      return value;
    }
    deepFreeze([ENVIRONMENTS, QUESTIONS, RELATED_WORDS, ANTONYMS, SYNONYM_ROUNDS, ANTONYM_ROUNDS, PHRASE_ROUNDS, STORY_ROUNDS, LISTEN_ROUNDS, USAGE_CONCEPTS, USAGE_ROUNDS, NUANCE_SETS, TONE_SCENARIOS, QUESTION_BY_ID, ROUND_BY_ID, GAME_INFO, LEVELS, ACCENT_OPTIONS, UI_TRANSLATIONS, ONBOARDING_LANGUAGES, WORD_GLOSSES, STARTER_PATHS, GUIDED_PATHS, SCENE_DIFFICULTY, REVIEW_INTERVAL_DAYS, DEFAULT_PROGRESS, ACADEMY_CONTENT]);
    const loadedProgress = loadProgress();
    const recoveredSession = loadActiveSession();
    const state = {
      view: loadedProgress.level ? 'home' : 'onboarding',
      progress: loadedProgress,
      session: recoveredSession.session,
      miniSession: recoveredSession.miniSession,
      toneSession: recoveredSession.toneSession,
      nuanceFamily: 'anger',
      selectedNuanceWord: null,
      bookFilter: 'saved',
      bookSearch: '',
      pendingImport: null,
      flashcardSession: null,
      academyClass: 8,
      academySection: 'overview',
      academyWritingFilter: 'all',
      academyOpenAnswerId: null,
      onboardingStep: loadedProgress.level ? 'level' : 'language',
      onboardingLevel: loadedProgress.level || null,
      onboardingLanguage: loadedProgress.level ? (loadedProgress.uiLanguage || 'en') : null,
      onboardingShowGloss: Boolean(loadedProgress.showGloss)
    };

    const main = document.getElementById('main-content');
    const toastEl = document.getElementById('toast');
    let toastTimer = null;

    function hasOwn(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }
    // Strip markup/control characters and bound free text before it enters recoverable state or storage.
    function sanitizeUserText(value, maxLength = 120) {
      return String(value == null ? '' : value).replace(/[<>\u0000-\u001f\u007f-\u009f]/g, '').slice(0, maxLength);
    }
    function isDateKey(value) {
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const [year, month, day] = value.split('-').map(Number);
      if (year < 1970 || month < 1 || month > 12 || day < 1 || day > 31) return false;
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }
    // Browser storage and imported backups are user-controlled; rebuild only the known progress schema.
    function sanitizeProgress(stored) {
      if (!stored || typeof stored !== 'object' || Array.isArray(stored)) throw new Error('Progress must be an object.');
      const array = value => Array.isArray(value) ? value.filter(id => hasOwn(QUESTION_BY_ID, id)) : [];
      const count = value => Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
      const gameIds = ['scene', 'synonym', 'antonym', 'phrase', 'listen', 'story', 'recall', 'usage', 'daily', 'review', 'tone'];
      const statIds = ['scene', 'synonym', 'antonym', 'phrase', 'listen', 'story', 'recall', 'usage'];
      const totalAnswered = count(stored.totalAnswered);
      const totalCorrect = Math.min(totalAnswered, count(stored.totalCorrect));
      const runs = Object.fromEntries(gameIds.map(id => [id, count(stored.gameRuns && stored.gameRuns[id])]));
      const gameStats = Object.fromEntries(statIds.map(id => {
        const source = stored.gameStats && stored.gameStats[id];
        const answered = count(source && source.answered);
        return [id, { answered, correct: Math.min(answered, count(source && source.correct)) }];
      }));
      const practiceDates = Array.isArray(stored.practiceDates) ? stored.practiceDates.filter(isDateKey).slice(-60) : [];
      const rawSchedule = stored.reviewSchedule && typeof stored.reviewSchedule === 'object' ? stored.reviewSchedule : {};
      const reviewSchedule = Object.fromEntries(Object.keys(rawSchedule).filter(id => hasOwn(QUESTION_BY_ID, id)).map(id => {
        const entry = rawSchedule[id] && typeof rawSchedule[id] === 'object' ? rawSchedule[id] : {};
        return [id, { stage: Math.min(REVIEW_INTERVAL_DAYS.length, count(entry.stage)), dueAt: Number.isFinite(entry.dueAt) && entry.dueAt >= 0 ? entry.dueAt : 0, correctCount: count(entry.correctCount), lapses: count(entry.lapses), lastReviewedAt: Number.isFinite(entry.lastReviewedAt) && entry.lastReviewedAt >= 0 ? entry.lastReviewedAt : null }];
      }));
      const rawMastery = stored.masteryLevels && typeof stored.masteryLevels === 'object' ? stored.masteryLevels : {};
      const masteryLevels = Object.fromEntries(Object.keys(rawMastery).filter(id => hasOwn(QUESTION_BY_ID, id) && ['Easy', 'Medium', 'Hard'].includes(rawMastery[id])).map(id => [id, rawMastery[id]]));
      const glossLanguage = ['en', 'es', 'hi', 'bn', 'fr'].includes(stored.glossLanguage) ? stored.glossLanguage : 'es';
      const rawNotes = stored.wordNotes && typeof stored.wordNotes === 'object' ? stored.wordNotes : {};
      const wordNotes = Object.fromEntries(Object.keys(rawNotes).filter(id => hasOwn(QUESTION_BY_ID, id)).map(id => [id, sanitizeUserText(rawNotes[id], 500).trim()]).filter(([, note]) => note.length > 0));
      return {
        totalAnswered,
        totalCorrect,
        streak: count(stored.streak),
        lastPlayed: isDateKey(stored.lastPlayed) ? stored.lastPlayed : null,
        practiceDates: [...new Set(practiceDates)],
        gameRuns: runs,
        gameStats,
        savedIds: [...new Set(array(stored.savedIds))],
        missedIds: [...new Set(array(stored.missedIds))],
        exploredIds: [...new Set(array(stored.exploredIds))],
        reviewSchedule,
        masteryLevels,
        wordNotes,
        level: hasOwn(LEVELS, stored.level) ? stored.level : null,
        accent: ACCENT_OPTIONS.some(option => option.value === stored.accent) ? stored.accent : 'en-US',
        uiLanguage: ['en', 'es', 'hi', 'bn', 'fr'].includes(stored.uiLanguage) ? stored.uiLanguage : 'en',
        glossLanguage,
        showGloss: stored.showGloss === true && glossLanguage !== 'en',
        theme: stored.theme === 'dark' ? 'dark' : 'light',
        soundEnabled: stored.soundEnabled === true
      };
    }
    function readProgressFromStorage(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? sanitizeProgress(JSON.parse(raw)) : null;
      } catch (error) {
        return null;
      }
    }
    function loadProgress() {
      return readProgressFromStorage(progressStorageKey()) || sanitizeProgress(DEFAULT_PROGRESS);
    }
    function createProgressBackup() {
      return { app: 'wordtrail', version: 1, exportedAt: new Date().toISOString(), progress: JSON.parse(JSON.stringify(state.progress)) };
    }
    function exportProgress() {
      try {
        if (typeof Blob === 'undefined' || !window.URL || typeof window.URL.createObjectURL !== 'function') throw new Error('Downloads are not available.');
        const blob = new Blob([JSON.stringify(createProgressBackup(), null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wordtrail-backup-${todayKey()}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        showToast('Progress backup downloaded. Keep it somewhere safe.');
      } catch (error) {
        showToast('Could not create a backup in this browser.');
      }
    }
    function prepareProgressImport(text) {
      const backup = JSON.parse(text);
      if (!backup || backup.app !== 'wordtrail' || backup.version !== 1 || !backup.progress) throw new Error('This is not a supported Wordtrail backup.');
      state.pendingImport = sanitizeProgress(backup.progress);
      return state.pendingImport;
    }
    async function readProgressImport(file) {
      if (!file) return;
      if (Number.isFinite(file.size) && file.size > 1_000_000) {
        showToast('That backup is larger than expected. Choose a Wordtrail backup under 1 MB.');
        return;
      }
      try {
        if (typeof file.text !== 'function') throw new Error('File reading is not available.');
        prepareProgressImport(await file.text());
        state.bookFilter = 'saved';
        state.bookSearch = '';
        render();
      } catch (error) {
        state.pendingImport = null;
        render();
        showToast('That file is not a valid Wordtrail backup. Your current progress is unchanged.');
      }
    }
    function confirmProgressImport() {
      if (!state.pendingImport) return;
      state.progress = state.pendingImport;
      state.pendingImport = null;
      state.session = null;
      state.miniSession = null;
      state.toneSession = null;
      saveProgress();
      resetPracticeHistory();
      state.view = 'wordbook';
      render();
      showToast('Backup restored. Your previous browser progress was replaced.');
    }
    // Rebuild checkpoints from canonical IDs and validated orders; never trust persisted markup or options.
    function loadActiveSession() {
      const empty = { session: null, miniSession: null, toneSession: null };
      try {
        const saved = JSON.parse(localStorage.getItem(activeSessionStorageKey()) || 'null');
        if (!saved || ![1, 2].includes(saved.version)) return empty;
        const validInt = (value, min, max, fallback = min) => Number.isInteger(value) && value >= min && value <= max ? value : fallback;
        let session = null;
        let miniSession = null;
        let toneSession = null;
        if (saved.scene && ['starter', 'daily', 'environment', 'review'].includes(saved.scene.mode)) {
          const envId = saved.scene.envId && ENVIRONMENTS.some(env => env.id === saved.scene.envId) ? saved.scene.envId : null;
          const questionIds = Array.isArray(saved.scene.questionIds) ? saved.scene.questionIds.slice(0, 50) : [];
          const savedOptionOrders = Array.isArray(saved.scene.optionOrders) ? saved.scene.optionOrders : [];
          const questions = questionIds.map((id, index) => {
            if (!hasOwn(QUESTION_BY_ID, id)) return null;
            const question = QUESTION_BY_ID[id];
            return { ...question, options: restoreOptionOrder(question.options, savedOptionOrders[index]) };
          }).filter(Boolean);
          if (questions.length && questions.length === questionIds.length) {
            const index = validInt(saved.scene.index, 0, questions.length - 1);
            const validChoice = typeof saved.scene.choice === 'string' && questions[index].options.includes(saved.scene.choice) ? saved.scene.choice : null;
            const showingFeedback = Boolean(saved.scene.showingFeedback) && validChoice !== null;
            const answered = Math.min(index + (showingFeedback ? 1 : 0), validInt(saved.scene.answered, 0, questions.length, 0));
            const correct = Math.min(answered, validInt(saved.scene.correct, 0, questions.length, 0));
            session = {
              mode: saved.scene.mode, envId, questions, index,
              correct, answered,
              choice: validChoice, showingFeedback,
              missedIds: Array.isArray(saved.scene.missedIds) ? [...new Set(saved.scene.missedIds.filter(id => hasOwn(QUESTION_BY_ID, id)))] : [],
              finished: false
            };
          }
        }
        if (saved.mini && ['daily', 'review', 'synonym', 'antonym', 'phrase', 'story', 'listen', 'recall', 'usage'].includes(saved.mini.mode)) {
          const roundIds = Array.isArray(saved.mini.roundIds) ? saved.mini.roundIds.slice(0, 5) : [];
          const savedOptionOrders = Array.isArray(saved.mini.optionOrders) ? saved.mini.optionOrders : [];
          const canonicalRounds = roundIds.map(id => {
            if (hasOwn(ROUND_BY_ID, id)) return ROUND_BY_ID[id];
            if (typeof id === 'string' && id.startsWith('scene-')) {
              const question = hasOwn(QUESTION_BY_ID, id.slice(6)) ? QUESTION_BY_ID[id.slice(6)] : null;
              return question ? makeSceneMiniRound(question) : null;
            }
            if (typeof id === 'string' && id.startsWith('recall-')) {
              const question = hasOwn(QUESTION_BY_ID, id.slice(7)) ? QUESTION_BY_ID[id.slice(7)] : null;
              return question ? makeRecallMiniRound(question) : null;
            }
            return null;
          }).filter(Boolean);
          const rounds = canonicalRounds.map((round, index) => Array.isArray(round.options)
            ? { ...round, options: restoreOptionOrder(round.options, savedOptionOrders[index]) }
            : round);
          if (rounds.length && rounds.length === roundIds.length) {
            const index = validInt(saved.mini.index, 0, rounds.length - 1);
            const savedChoice = saved.mini.choice;
            const cleanSavedChoice = sanitizeUserText(savedChoice, 100);
            const validChoice = typeof savedChoice === 'string' && cleanSavedChoice.length > 0 && (rounds[index].type === 'recall' ? cleanSavedChoice.trim().length > 0 : Array.isArray(rounds[index].options) && rounds[index].options.includes(cleanSavedChoice)) ? cleanSavedChoice : null;
            const answered = Math.min(index + (validChoice !== null ? 1 : 0), validInt(saved.mini.answered, 0, rounds.length, 0));
            const correct = Math.min(answered, validInt(saved.mini.correct, 0, rounds.length, 0));
            miniSession = {
              mode: saved.mini.mode, rounds, index,
              choice: validChoice,
              correct, answered,
              results: Array.isArray(saved.mini.results) ? saved.mini.results.filter(result => result && rounds.some(round => round.id === result.id)).slice(0, 5).map(result => ({ id: result.id, choice: sanitizeUserText(result.choice, 100), correct: Boolean(result.correct) })) : [],
              draftAnswer: sanitizeUserText(saved.mini.draftAnswer, 80),
              hintVisible: Boolean(saved.mini.hintVisible),
              missedIds: Array.isArray(saved.mini.missedIds) ? [...new Set(saved.mini.missedIds.filter(id => rounds.some(round => round.id === id)))] : [],
              finished: false
            };
          }
        }
        if (saved.tone && Number.isInteger(saved.tone.index) && saved.tone.index >= 0 && saved.tone.index < TONE_SCENARIOS.length) {
          const index = saved.tone.index;
          const savedToneOrders = Array.isArray(saved.tone.optionOrders) ? saved.tone.optionOrders : [];
          const optionsByScenario = TONE_SCENARIOS.map((scenario, scenarioIndex) => restoreOptionOrder(scenario.options, savedToneOrders[scenarioIndex], option => option.text));
          const legacyChoice = Number.isInteger(saved.tone.choice) && saved.tone.choice >= 0 && saved.tone.choice < TONE_SCENARIOS[index].options.length ? saved.tone.choice : null;
          const currentOrderValid = isOptionOrder(savedToneOrders[index], TONE_SCENARIOS[index].options, option => option.text);
          let choice = legacyChoice;
          if (saved.version === 1 && legacyChoice !== null) {
            const previouslySelected = TONE_SCENARIOS[index].options[legacyChoice];
            choice = optionsByScenario[index].findIndex(option => option.text === previouslySelected.text);
          } else if (saved.version === 2 && !currentOrderValid) choice = null;
          const maxAnswered = index + (choice !== null ? 1 : 0);
          toneSession = { index, choice, optionsByScenario, correct: Math.min(maxAnswered, validInt(saved.tone.correct, 0, TONE_SCENARIOS.length, 0)), finished: false };
        }
        // A legitimate checkpoint has exactly one active activity; discard manipulated mixed-state payloads.
        if ([session, miniSession, toneSession].filter(Boolean).length > 1) return empty;
        return { session, miniSession, toneSession };
      } catch (error) {
        return empty;
      }
    }
    function persistActiveSession() {
      if (typeof state === 'undefined') return;
      const saved = { version: 2, scene: null, mini: null, tone: null };
      if (state.session && !state.session.finished && state.session.questions && state.session.index < state.session.questions.length) {
        saved.scene = { mode: state.session.mode, envId: state.session.envId, questionIds: state.session.questions.map(question => question.id), optionOrders: state.session.questions.map(question => optionKeys(question.options)), index: state.session.index, correct: state.session.correct, answered: state.session.answered, choice: state.session.choice, showingFeedback: state.session.showingFeedback, missedIds: state.session.missedIds };
      }
      if (state.miniSession && !state.miniSession.finished && state.miniSession.rounds && state.miniSession.index < state.miniSession.rounds.length) {
        saved.mini = { mode: state.miniSession.mode, roundIds: state.miniSession.rounds.map(round => round.id), optionOrders: state.miniSession.rounds.map(round => Array.isArray(round.options) ? optionKeys(round.options) : null), index: state.miniSession.index, choice: state.miniSession.choice === null ? null : sanitizeUserText(state.miniSession.choice, 100), correct: state.miniSession.correct, answered: state.miniSession.answered, results: state.miniSession.results.map(result => ({ id: result.id, choice: sanitizeUserText(result.choice, 100), correct: Boolean(result.correct) })), draftAnswer: sanitizeUserText(state.miniSession.draftAnswer, 80), hintVisible: Boolean(state.miniSession.hintVisible), missedIds: state.miniSession.missedIds };
      }
      if (state.toneSession && !state.toneSession.finished && state.toneSession.index < TONE_SCENARIOS.length) {
        saved.tone = { index: state.toneSession.index, choice: state.toneSession.choice, correct: state.toneSession.correct, optionOrders: state.toneSession.optionsByScenario.map(options => optionKeys(options, option => option.text)) };
      }
      try {
        if (saved.scene || saved.mini || saved.tone) localStorage.setItem(activeSessionStorageKey(), JSON.stringify(saved));
        else localStorage.removeItem(activeSessionStorageKey());
      } catch (error) { /* Session recovery is optional when storage is unavailable. */ }
    }
    function saveProgress() {
      try { localStorage.setItem(progressStorageKey(), JSON.stringify(state.progress)); } catch (error) { /* Private browsing can disable storage; the session still works. */ }
      queueCloudProgressSync();
    }
    function queueCloudProgressSync() {
      if (!currentUser || cloudLoadedUserId !== currentUser.id || !cloudApi || !cloudApi.isSupabaseReady) return;
      clearTimeout(cloudSyncTimer);
      const userId = currentUser.id;
      cloudSyncTimer = setTimeout(async () => {
        if (!currentUser || currentUser.id !== userId) return;
        try {
          await cloudApi.syncUserSnapshot(userId, accountDisplayName(currentUser), state.progress);
          const message = document.getElementById('auth-message');
          if (message && document.getElementById('auth-dialog')?.open) message.textContent = 'Synced to your account.';
        } catch (error) {
          console.warn('Cloud sync is unavailable; progress remains saved on this device.', error);
          const now = Date.now();
          if (now - lastCloudErrorToast > 30000) {
            lastCloudErrorToast = now;
            showToast('Cloud sync paused. Your local progress is still saved.');
          }
        }
      }, 700);
    }
    function queueCloudQuizResult(gameType) {
      if (!currentUser || cloudLoadedUserId !== currentUser.id || !cloudApi || !cloudApi.isSupabaseReady) return;
      let score = 0;
      let total = 0;
      if (state.session && state.session.finished) {
        score = state.session.correct;
        total = state.session.questions.length;
      } else if (state.miniSession && state.miniSession.finished) {
        score = state.miniSession.correct;
        total = state.miniSession.rounds.length;
      } else if (state.toneSession && state.toneSession.finished) {
        score = state.toneSession.correct;
        total = TONE_SCENARIOS.length;
      }
      if (!total) return;
      const userId = currentUser.id;
      cloudApi.saveQuizResult(userId, { gameType, score, total }).catch(error => {
        console.warn('Quiz score remains in local progress because cloud save failed.', error);
      });
    }
    function dateKey(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    function todayKey() { return dateKey(new Date()); }
    function previousDayKey() {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return dateKey(yesterday);
    }
    function recordActivity(question, correct, gameType = 'scene') {
      const progress = state.progress;
      progress.totalAnswered += 1;
      if (correct) progress.totalCorrect += 1;
      if (!progress.gameStats) progress.gameStats = {};
      if (!progress.gameStats[gameType]) progress.gameStats[gameType] = { answered: 0, correct: 0 };
      progress.gameStats[gameType].answered += 1;
      if (correct) progress.gameStats[gameType].correct += 1;
      if (question && QUESTION_BY_ID[question.id]) {
        if (correct) progress.missedIds = progress.missedIds.filter(id => id !== question.id);
        else if (!progress.missedIds.includes(question.id)) progress.missedIds.push(question.id);
        if (!progress.exploredIds.includes(question.id)) progress.exploredIds.push(question.id);
        updateReviewSchedule(question, correct);
      }
      saveProgress();
    }
    function updateReviewSchedule(question, correct, now = Date.now()) {
      if (!question || !QUESTION_BY_ID[question.id]) return;
      if (!state.progress.reviewSchedule) state.progress.reviewSchedule = {};
      const previous = state.progress.reviewSchedule[question.id] || { stage: 0, dueAt: 0, correctCount: 0, lapses: 0, lastReviewedAt: null };
      const wasDue = !previous.dueAt || previous.dueAt <= now;
      let stage = previous.stage;
      let dueAt = previous.dueAt;
      let correctCount = previous.correctCount || 0;
      let lapses = previous.lapses || 0;
      if (correct) {
        correctCount += 1;
        if (wasDue) {
          stage = Math.min(REVIEW_INTERVAL_DAYS.length, stage + 1);
          const intervalDays = REVIEW_INTERVAL_DAYS[Math.max(0, stage - 1)];
          dueAt = now + intervalDays * 24 * 60 * 60 * 1000;
        }
      } else {
        stage = 0;
        dueAt = now;
        lapses += 1;
      }
      state.progress.reviewSchedule[question.id] = { stage, dueAt, correctCount, lapses, lastReviewedAt: now };
    }
    function dueReviewIds(now = Date.now()) {
      const schedule = state.progress.reviewSchedule || {};
      const scheduled = Object.keys(schedule).filter(id => QUESTION_BY_ID[id] && Number.isFinite(schedule[id].dueAt) && schedule[id].dueAt <= now).sort((a, b) => schedule[a].dueAt - schedule[b].dueAt);
      const unscheduledMisses = state.progress.missedIds.filter(id => !schedule[id]);
      return [...new Set([...unscheduledMisses, ...scheduled])];
    }
    // The displayed streak expires after a missed calendar day; stored history remains intact.
    function currentPracticeStreak(progress = state.progress) {
      return progress.lastPlayed === todayKey() || progress.lastPlayed === previousDayKey() ? progress.streak : 0;
    }
    function markPracticeDay(gameType = 'scene') {
      const progress = state.progress;
      if (!progress.gameRuns) progress.gameRuns = {};
      progress.gameRuns[gameType] = (progress.gameRuns[gameType] || 0) + 1;
      const today = todayKey();
      if (!progress.practiceDates.includes(today)) {
        if (progress.lastPlayed !== today) progress.streak = progress.lastPlayed === previousDayKey() ? currentPracticeStreak(progress) + 1 : 1;
        progress.lastPlayed = today;
        progress.practiceDates = [...new Set([...progress.practiceDates, today])].slice(-60);
      }
      saveProgress();
      queueCloudQuizResult(gameType);
    }
    function currentWeekDays() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const monday = new Date(today);
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
      return Array.from({ length: 7 }, (_, index) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + index);
        return { key: dateKey(day), short: new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(day), number: day.getDate(), future: day > today, active: state.progress.practiceDates.includes(dateKey(day)) };
      });
    }
    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    }
    function uiText(english) { const language = state.progress.uiLanguage; return (ACADEMY_UI_TRANSLATIONS[language] || {})[english] || (UI_TRANSLATIONS[language] || {})[english] || english; }
    function localizeCopy(text) {
      const translations = UI_TRANSLATIONS[state.progress.uiLanguage];
      if (!translations) return String(text);
      let output = String(text);
      for (const [english, localized] of Object.entries(translations).sort((a, b) => b[0].length - a[0].length)) output = output.split(english).join(localized);
      return output;
    }
    // Translate interface copy only; curated English examples stay intact for language practice.
    function translateMarkup(markup) {
      const translations = UI_TRANSLATIONS[state.progress.uiLanguage];
      if (!translations) return String(markup);
      const entries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
      // Only translate text nodes; never rewrite input values, data attributes, IDs, or markup structure.
      return String(markup).replace(/>([^<]+)</g, (match, text) => {
        let output = text;
        for (const [english, localized] of entries) output = output.split(escapeHtml(english)).join(escapeHtml(localized));
        return `>${output}<`;
      });
    }
    function translateShell() {
      const language = state.progress.uiLanguage || 'en';
      if (document.documentElement) document.documentElement.lang = ({ en:'en', es:'es', hi:'hi', bn:'bn', fr:'fr' })[language] || 'en';
      if (typeof document.querySelectorAll === 'function') {
        document.querySelectorAll('[data-i18n]').forEach(element => {
          const key = element.dataset && element.dataset.i18n;
          if (key && 'textContent' in element) element.textContent = uiText(key);
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
          const key = element.dataset && element.dataset.i18nAria;
          if (key) element.setAttribute('aria-label', uiText(key));
        });
      }
      if (main && typeof main.querySelectorAll === 'function') {
        main.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
          const key = element.dataset && element.dataset.i18nPlaceholder;
          if (key) element.setAttribute('placeholder', uiText(key));
        });
        main.querySelectorAll('[data-i18n-aria]').forEach(element => {
          const key = element.dataset && element.dataset.i18nAria;
          if (key) element.setAttribute('aria-label', uiText(key));
        });
      }
    }
    function updateSettingsControls() {
      const ui = document.getElementById('ui-language-select');
      const gloss = document.getElementById('gloss-language-select');
      const toggle = document.getElementById('gloss-toggle');
      const theme = document.getElementById('theme-toggle');
      const sound = document.getElementById('sound-toggle');
      if (ui) ui.value = state.progress.uiLanguage || 'en';
      if (gloss) gloss.value = state.progress.glossLanguage || 'es';
      if (toggle) toggle.checked = Boolean(state.progress.showGloss);
      if (theme) { theme.textContent = uiText(state.progress.theme === 'dark' ? 'Light theme' : 'Dark theme'); theme.setAttribute('aria-pressed', String(state.progress.theme === 'dark')); }
      if (sound) { sound.textContent = uiText(state.progress.soundEnabled ? 'Answer sounds: on' : 'Answer sounds: off'); sound.setAttribute('aria-pressed', String(Boolean(state.progress.soundEnabled))); }
      translateShell();
    }
    function localizeSafeAttributes(fragment) {
      if (state.progress.uiLanguage === 'en' || !fragment || typeof fragment.querySelectorAll !== 'function') return;
      fragment.querySelectorAll('*').forEach(element => {
        for (const name of ['aria-label', 'title', 'placeholder']) {
          if (element.hasAttribute(name)) element.setAttribute(name, localizeCopy(element.getAttribute(name)));
        }
      });
    }
    function renderGlossLine(questionId) {
      if (!state.progress.showGloss || !hasOwn(QUESTION_BY_ID, questionId)) return '';
      const language = state.progress.glossLanguage;
      const gloss = WORD_GLOSSES[questionId] && WORD_GLOSSES[questionId][language];
      if (!gloss) return '';
      const locale = GLOSS_LOCALES[language];
      return `<p class="native-gloss"><strong>${escapeHtml(uiText('Gloss'))} · ${escapeHtml(language.toUpperCase())}</strong> ${escapeHtml(gloss)} <button class="gloss-audio" type="button" data-action="speak-gloss" data-word="${escapeHtml(gloss)}" data-language="${escapeHtml(locale)}" aria-label="${escapeHtml(uiText('Listen'))} ${escapeHtml(gloss)}">▶</button></p>`;
    }
    let answerAudioContext = null;
    function playAnswerChime(correct) {
      if (!state.progress.soundEnabled) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        answerAudioContext = answerAudioContext || new AudioContextClass();
        const play = () => {
          const oscillator = answerAudioContext.createOscillator();
          const gain = answerAudioContext.createGain();
          const now = answerAudioContext.currentTime;
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(correct ? 660 : 230, now);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.065, now + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (correct ? 0.19 : 0.24));
          oscillator.connect(gain); gain.connect(answerAudioContext.destination);
          oscillator.start(now); oscillator.stop(now + (correct ? 0.2 : 0.25));
        };
        if (answerAudioContext.state === 'suspended' && answerAudioContext.resume) answerAudioContext.resume().then(play).catch(() => {});
        else play();
      } catch (error) { /* Audio is optional and must never block an answer. */ }
    }
    const SAFE_HTML_TAGS = new Set(['div', 'span', 'h1', 'h2', 'h3', 'h4', 'p', 'article', 'button', 'section', 'header', 'aside', 'form', 'label', 'input', 'small', 'strong', 'b', 'svg', 'path', 'br', 'blockquote', 'a', 'ol', 'ul', 'li', 'details', 'summary', 'select', 'option', 'details', 'summary', 'textarea']);
    const SAFE_HTML_ATTRIBUTES = new Set(['class', 'id', 'role', 'tabindex', 'title', 'type', 'name', 'value', 'placeholder', 'autocomplete', 'autocapitalize', 'spellcheck', 'maxlength', 'enterkeyhint', 'for', 'accept', 'disabled', 'required', 'open', 'href', 'viewbox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd']);
    const SAFE_HTML_IDS = new Set(['practice-preview-title', 'progress-import', 'word-search', 'recall-form', 'recall-answer', 'recall-clue', 'onboarding-gloss-toggle']); // Fixed IDs prevent DOM clobbering.
    const SAFE_ARIA_ATTRIBUTES = new Set(['aria-label', 'aria-labelledby', 'aria-live', 'aria-atomic', 'aria-controls', 'aria-expanded', 'aria-pressed', 'aria-current', 'aria-hidden', 'aria-disabled', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax']);
    const SAFE_DATA_ATTRIBUTES = new Set(['data-action', 'data-answer', 'data-env', 'data-family', 'data-filter', 'data-game', 'data-id', 'data-index', 'data-grade', 'data-section', 'data-writing-filter', 'data-writing-id', 'data-i18n-aria', 'data-i18n-placeholder', 'data-language', 'data-level', 'data-rate', 'data-view', 'data-word']);
    function sanitizeInlineStyle(value) {
      const allowed = new Set(['--game-tint', '--score', 'background', 'color', 'width', 'font-size', 'margin', 'margin-top', 'margin-left']);
      const rules = [];
      for (const declaration of String(value).split(';')) {
        const separator = declaration.indexOf(':');
        if (separator < 1) continue;
        const property = declaration.slice(0, separator).trim().toLowerCase();
        const content = declaration.slice(separator + 1).trim();
        if (!allowed.has(property) || !content || content.length > 80 || /url|expression|javascript|@import/i.test(content) || !/^[#(),.%\w\s-]+$/.test(content)) continue;
        const valid = property === '--game-tint' || property === 'background' || property === 'color' ? /^#[0-9a-f]{3,8}$/i.test(content)
          : property === '--score' ? /^(?:100|[1-9]?\d)$/.test(content)
          : property === 'width' ? /^(?:100|[1-9]?\d)(?:\.\d+)?%$/.test(content)
          : property === 'font-size' ? /^\d+(?:\.\d+)?px$/.test(content)
          : property === 'margin-left' ? /^(?:auto|0|\d+(?:\.\d+)?(?:px|rem|em|%))$/.test(content)
          : /^(?:0|\d+(?:\.\d+)?(?:px|rem|em|%))$/.test(content);
        if (valid) rules.push(`${property}:${content}`);
      }
      return rules.join(';');
    }
    // Renderers still use readable templates, but only this allowlist sanitizer may turn them into mounted DOM.
    function sanitizeHtmlFragment(markup) {
      const template = document.createElement('template');
      template.innerHTML = String(markup == null ? '' : markup); // inert template only; never mounted before sanitizing
      const fragment = template.content;
      const elements = Array.from(fragment.querySelectorAll('*'));
      for (const element of elements) {
        if (!fragment.contains(element)) continue;
        const tag = element.tagName.toLowerCase();
        if (!SAFE_HTML_TAGS.has(tag) || (tag === 'path' && (!element.parentElement || element.parentElement.tagName.toLowerCase() !== 'svg'))) {
          if (['script', 'style', 'iframe', 'object', 'embed', 'template', 'link', 'meta', 'base'].includes(tag)) element.remove();
          else element.replaceWith(document.createTextNode(element.textContent || ''));
          continue;
        }
        for (const attribute of Array.from(element.attributes)) {
          const name = attribute.name.toLowerCase();
          const content = attribute.value;
          if (name === 'style') {
            const safeStyle = sanitizeInlineStyle(content);
            if (safeStyle) element.setAttribute('style', safeStyle); else element.removeAttribute(attribute.name);
          } else if (name === 'href') {
            if (/^https:\/\/nctb\.gov\.bd\/[a-z0-9/_-]+$/i.test(content)) element.setAttribute(attribute.name, content); else element.removeAttribute(attribute.name);
          } else if (SAFE_HTML_ATTRIBUTES.has(name) || SAFE_ARIA_ATTRIBUTES.has(name)) {
            if (name === 'id' && !SAFE_HTML_IDS.has(content)) element.removeAttribute(attribute.name);
            else if (name === 'name' && content !== 'answer') element.removeAttribute(attribute.name);
            else if (name === 'class' && !/^[a-zA-Z0-9_ -]{0,240}$/.test(content)) element.removeAttribute(attribute.name);
            else if (name === 'd' && !/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/.test(content)) element.removeAttribute(attribute.name);
            else if (name === 'fill' || name === 'stroke') { if (!/^(?:none|currentColor|#[0-9a-f]{3,8})$/i.test(content)) element.removeAttribute(attribute.name); }
            else if (name === 'viewbox' && !/^[0-9. -]{1,60}$/.test(content)) element.removeAttribute(attribute.name);
            else if (/^aria-(?:expanded|pressed|hidden|atomic)$/.test(name) && !/^(?:true|false)$/.test(content)) element.removeAttribute(attribute.name);
            else if (name === 'aria-live' && !/^(?:off|polite|assertive)$/.test(content)) element.removeAttribute(attribute.name);
            else if (/^aria-value(?:now|min|max)$/.test(name) && !/^\d{1,3}$/.test(content)) element.removeAttribute(attribute.name);
            else if (name === 'aria-current' && !/^(?:page|false|true|step|location|date|time)$/.test(content)) element.removeAttribute(attribute.name);
            else if (['value', 'placeholder', 'title', 'aria-label', 'aria-labelledby'].includes(name)) element.setAttribute(attribute.name, sanitizeUserText(content, 200));
          } else if (SAFE_DATA_ATTRIBUTES.has(name)) {
            element.setAttribute(attribute.name, sanitizeUserText(content, 120));
          } else element.removeAttribute(attribute.name); // strips every on* handler, URL, srcdoc, and unrecognized attribute
        }
      }
      return fragment;
    }
    function iconArrow() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'; }
    function speakerIcon() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 3V7l-4 3H4Z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>'; }
    function getEnvironment(id) { return ENVIRONMENTS.find(env => env.id === id) || ENVIRONMENTS[0]; }
    function getEnvironmentQuestions(id) { return QUESTIONS.filter(question => question.env === id); }
    function questionPoolForLevel(source, level = state.progress.level) {
      const everyday = source.filter(question => question.band !== 'Stretch');
      if (level === 'beginner' || level === 'unsure' || !level) return everyday.length ? everyday : source;
      return source;
    }
    function everydayQuestions() { return questionPoolForLevel(QUESTIONS); }
    function shuffled(items) {
      const result = items.slice();
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
    // Rotation is local to this browser/account and separate from the progress/backup schema.
    // Recent items go to the back of their pool; once every item has appeared, reuse is inevitable.
    const practiceHistoryMemory = new Map();
    function practiceHistoryKey() { return `${progressStorageKey()}:practice-history-v1`; }
    function readPracticeHistory() {
      const key = practiceHistoryKey();
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || 'null');
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const clean = Object.create(null);
          for (const [mode, ids] of Object.entries(parsed).slice(0, 40)) {
            if (/^[a-z-]{1,30}$/.test(mode) && Array.isArray(ids))
              clean[mode] = ids.filter(id => typeof id === 'string' && /^[a-z0-9-]{1,100}$/.test(id)).slice(-1200);
          }
          practiceHistoryMemory.set(key, clean);
          return clean;
        }
      } catch (error) { /* Invalid or unavailable browser storage is ignored. */ }
      return practiceHistoryMemory.get(key) || Object.create(null);
    }
    function resetPracticeHistory() {
      const key = practiceHistoryKey();
      practiceHistoryMemory.delete(key);
      try { localStorage.removeItem(key); } catch (error) { /* In-memory rotation is also reset. */ }
    }
    function rotatePractice(items, count, mode, weightOf = () => 1, groupOf = item => item.id) {
      const pool = shuffled(items);
      const history = readPracticeHistory();
      const recent = history[mode] || [];
      const recency = new Map(recent.map((id, index) => [id, index]));
      const lastUsed = id => recency.get(id) ?? -1;
      // The shuffle breaks ties without always following the same content order.
      const tieScores = new Map(pool.map(item => [item.id, Math.pow(Math.random(), 1 / weightOf(item))]));
      pool.sort((a, b) => lastUsed(a.id) - lastUsed(b.id) || tieScores.get(b.id) - tieScores.get(a.id));
      const selected = [];
      const groups = new Set();
      for (const item of pool) {
        if (groups.has(groupOf(item))) continue;
        selected.push(item);
        groups.add(groupOf(item));
        if (selected.length === count) break;
      }
      if (selected.length < count) for (const item of pool) {
        if (!selected.includes(item)) selected.push(item);
        if (selected.length === count) break;
      }
      history[mode] = [...recent, ...selected.map(item => item.id)].slice(-1200);
      const key = practiceHistoryKey();
      practiceHistoryMemory.set(key, history);
      try { localStorage.setItem(key, JSON.stringify(history)); } catch (error) { /* Still rotates in memory. */ }
      return selected;
    }
    // Every new question gets an unbiased Fisher–Yates option order; saved orders are validated before resume.
    function isOptionOrder(candidate, canonical, keyOf = value => value) {
      if (!Array.isArray(candidate) || candidate.length !== canonical.length) return false;
      const allowed = new Set(canonical.map(keyOf));
      const keys = candidate.map(value => typeof value === 'string' ? value : null);
      return keys.every(key => key !== null && allowed.has(key)) && new Set(keys).size === allowed.size;
    }
    function restoreOptionOrder(canonical, candidate, keyOf = value => value) {
      if (!isOptionOrder(candidate, canonical, keyOf)) return shuffled(canonical);
      const byKey = new Map(canonical.map(option => [keyOf(option), option]));
      return candidate.map(key => byKey.get(key));
    }
    function optionKeys(options, keyOf = value => value) { return options.map(keyOf); }
    function sampleForLevel(source, count, level = state.progress.level, mode = 'scene', excluded = []) {
      const eligible = questionPoolForLevel(source, level);
      const fresh = eligible.filter(question => !excluded.includes(question.id));
      const available = fresh.length >= count ? fresh : eligible;
      const stretchWeight = level === 'advanced' ? 6 : level === 'intermediate' ? 2 : 1;
      return rotatePractice(available, count, mode, item => item.band === 'Stretch' ? stretchWeight : 1);
    }
    function startSession(mode, envId = null, ids = null) {
      if (!['starter', 'daily', 'environment', 'review'].includes(mode)) return;
      let questions;
      if (mode === 'starter') questions = (ids || []).map(id => hasOwn(QUESTION_BY_ID, id) ? QUESTION_BY_ID[id] : null).filter(Boolean);
      else if (mode === 'environment') {
        const planned = Array.isArray(ids) ? ids.map(id => QUESTION_BY_ID[id]).filter(question => question && question.env === envId).slice(0, 5) : [];
        questions = planned.length ? planned : orderSceneQuestions(sampleForLevel(getEnvironmentQuestions(envId), 5, state.progress.level, `environment-${envId}`));
      }
      else if (mode === 'review') questions = (ids || getReviewIds()).map(id => hasOwn(QUESTION_BY_ID, id) ? QUESTION_BY_ID[id] : null).filter(Boolean).slice(0, 5);
      else questions = orderSceneQuestions(sampleForLevel(everydayQuestions(), 5, state.progress.level, 'daily-scene'));
      if (!questions.length) questions = sampleForLevel(everydayQuestions(), Math.min(5, everydayQuestions().length), state.progress.level, 'fallback-scene');
      questions = questions.map(question => ({ ...question, options: shuffled(question.options) }));
      state.session = { mode, envId, questions, index: 0, correct: 0, answered: 0, choice: null, showingFeedback: false, missedIds: [], finished: false };
      state.miniSession = null;
      state.toneSession = null;
      state.view = 'challenge';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // One support-language choice drives the app copy and optional native-language word hints.
    function selectOnboardingLanguage(languageCode) {
      const language = ONBOARDING_LANGUAGES.find(option => option.code === languageCode);
      if (!language) return;
      const previousLanguage = state.onboardingLanguage;
      state.onboardingLanguage = language.code;
      state.progress.uiLanguage = language.code;
      if (language.code === 'en') {
        state.onboardingShowGloss = false;
        state.progress.glossLanguage = 'en';
        state.progress.showGloss = false;
      } else {
        if ((previousLanguage === 'en' || previousLanguage === null) && !state.progress.showGloss) state.onboardingShowGloss = true;
        state.progress.glossLanguage = language.code;
        state.progress.showGloss = Boolean(state.onboardingShowGloss);
      }
      saveProgress();
      render();
    }
    function continueToOnboardingLevel() {
      if (!ONBOARDING_LANGUAGES.some(option => option.code === state.onboardingLanguage)) return;
      state.onboardingStep = 'level';
      state.onboardingLevel = state.progress.level || state.onboardingLevel || null;
      render();
      focusMainHeading();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function finishOnboarding() {
      const language = ONBOARDING_LANGUAGES.find(option => option.code === state.onboardingLanguage);
      const level = Object.prototype.hasOwnProperty.call(LEVELS, state.onboardingLevel) ? state.onboardingLevel : null;
      if (!language || !level) return;
      // Language and optional gloss preferences are committed when chosen; a level-only edit must not overwrite advanced settings.
      chooseStartingLevel(level);
    }
    function chooseStartingLevel(level) {
      if (!hasOwn(LEVELS, level) || !hasOwn(STARTER_PATHS, level)) return;
      state.progress.level = level;
      saveProgress();
      const path = STARTER_PATHS[level];
      startSession('starter', path.env, path.ids);
    }
    function recommendedLesson(level = state.progress.level || 'beginner') {
      const steps = GUIDED_PATHS[level] || GUIDED_PATHS.beginner;
      const explored = new Set(state.progress.exploredIds);
      const due = new Set(dueReviewIds());
      const starter = STARTER_PATHS[level] || STARTER_PATHS.beginner;
      const starterDue = starter.ids.filter(id => due.has(id));
      if (starterDue.length) {
        const support = starter.ids.filter(id => !due.has(id));
        const extra = questionPoolForLevel(getEnvironmentQuestions(starter.env), level)
          .filter(question => !starter.ids.includes(question.id));
        return { env: starter.env, ids: [...starterDue, ...support, ...extra.map(question => question.id)].slice(0, 5), phase: 1, total: steps.length + 1,
          goal: 'a quick revisit before the next guided lesson' };
      }
      for (const step of steps) {
        if (step.ids.every(id => explored.has(id)) && !step.ids.some(id => due.has(id))) continue;
        const missed = step.ids.filter(id => due.has(id));
        const newIds = step.ids.filter(id => !explored.has(id) && !due.has(id));
        const practiced = step.ids.filter(id => explored.has(id) && !due.has(id));
        // Due words open the round; the remaining tasks rise in curated order.
        const ids = [...missed, ...newIds, ...practiced].slice(0, 5);
        return { env: step.env, ids, phase: steps.indexOf(step) + 2, total: steps.length + 1, goal: 'a guided series from familiar clues to precise choices' };
      }
      // After the pathway, rotate environments instead of looping on the starter.
      const worlds = ['home', 'campus', 'market', 'workplace', 'travel'];
      return { env: worlds[(state.progress.gameRuns.scene || 0) % worlds.length], ids: null, goal: 'a varied next step at your level' };
    }
    function startRecommendedLesson() {
      const next = recommendedLesson();
      startSession('environment', next.env, next.ids);
    }
    function makeSceneMiniRound(question) {
      const env = getEnvironment(question.env);
      return { id: `scene-${question.id}`, type: 'scene', wordId: question.id, label: 'SCENE PICK', scene: `${env.name} · ${question.scene}`, sentence: question.sentence, prompt: 'Which word best completes this scene?', clue: question.hint, options: question.options, answer: question.answer, explanation: `${question.definition} ${question.nuance}` };
    }
    function makeRecallMiniRound(question) {
      const env = getEnvironment(question.env);
      return { id: `recall-${question.id}`, type: 'recall', wordId: question.id, label: 'RECALL FROM CONTEXT', scene: `${env.name} · ${question.scene}`, sentence: question.sentence, prompt: 'Read the scene, then type the missing word.', clue: question.hint, answer: question.answer, explanation: `${question.definition} ${question.nuance}` };
    }
    function startRecallReview(ids) {
      const rounds = [...new Set(Array.isArray(ids) ? ids : [])].map(id => hasOwn(QUESTION_BY_ID, id) ? QUESTION_BY_ID[id] : null).filter(Boolean).slice(0, 5).map(makeRecallMiniRound);
      if (rounds.length) startMiniGame('review', rounds);
      else startMiniGame('daily');
    }
    function startMiniGame(mode, presetRounds = null) {
      let rounds;
      if (presetRounds) {
        rounds = presetRounds;
        mode = 'review';
      } else if (mode === 'daily') {
        // Four different skills, with changing skill order and rotating question pools.
        const dueIds = dueReviewIds();
        // A due word gets a retrieval turn before new material, without forcing review when caught up.
        const dueQuestions = dueIds.map(id => QUESTION_BY_ID[id]).filter(question => question && (!['beginner', 'unsure'].includes(state.progress.level) || question.band !== 'Stretch'));
        const reviewQuestion = dueQuestions.length ? rotatePractice(dueQuestions, 1, 'sampler-due')[0] : null;
        const skills = rotatePractice([
          { id: 'scene' }, { id: 'synonym' }, { id: 'antonym' },
          { id: 'phrase' }, { id: 'listen' }, { id: 'story' }, ...(!reviewQuestion ? [{ id: 'recall' }] : [])
        ], reviewQuestion ? 3 : 4, 'sampler-skills');
        const sources = { synonym: SYNONYM_ROUNDS, antonym: ANTONYM_ROUNDS,
          phrase: PHRASE_ROUNDS, listen: LISTEN_ROUNDS, story: STORY_ROUNDS };
        const usedWords = reviewQuestion ? [reviewQuestion.id] : [];
        rounds = skills.map(({ id }) => {
          if (id === 'scene' || id === 'recall') {
            const question = sampleForLevel(everydayQuestions(), 1, state.progress.level, 'sampler-words', usedWords)[0];
            usedWords.push(question.id);
            return id === 'scene' ? makeSceneMiniRound(question) : makeRecallMiniRound(question);
          }
          const suitable = sources[id].filter(round => {
            const word = round.wordId && QUESTION_BY_ID[round.wordId];
            return !['beginner', 'unsure'].includes(state.progress.level) || !word || word.band !== 'Stretch';
          });
          const distinct = suitable.filter(round => !round.wordId || !usedWords.includes(round.wordId));
          const chosen = rotatePractice(distinct.length ? distinct : suitable, 1, `sampler-${id}`)[0];
          if (chosen.wordId) usedWords.push(chosen.wordId);
          return chosen;
        });
        if (reviewQuestion) rounds.push(makeRecallMiniRound(reviewQuestion));
        rounds = shuffled(rounds);
      } else if (mode === 'usage') {
        const history = readPracticeHistory().usage || [];
        const seen = new Set(history);
        const unseen = USAGE_ROUNDS.filter(round => !seen.has(round.id));
        const lastConcepts = new Set(history.slice(-5).map(id => ROUND_BY_ID[id]?.conceptId));
        if (unseen.length > 0 && unseen.length < 5) {
          const unseenFirst = rotatePractice(unseen, unseen.length, 'usage', () => 1, round => round.conceptId);
          const groups = new Set(unseenFirst.map(round => round.conceptId));
          const remainder = USAGE_ROUNDS.filter(round => !groups.has(round.conceptId));
          rounds = [...unseenFirst, ...rotatePractice(remainder, 5 - unseenFirst.length, 'usage', () => 1, round => round.conceptId)];
        } else {
          const pool = unseen.length ? unseen : USAGE_ROUNDS;
          const differentConcepts = pool.filter(round => !lastConcepts.has(round.conceptId));
          rounds = rotatePractice(differentConcepts.length >= 5 ? differentConcepts : pool, 5, 'usage', () => 1, round => round.conceptId);
        }
      } else if (mode === 'recall') {
        rounds = sampleForLevel(everydayQuestions(), 4, state.progress.level, 'recall').map(makeRecallMiniRound);
      } else {
        const sources = Object.assign(Object.create(null), { synonym: SYNONYM_ROUNDS, antonym: ANTONYM_ROUNDS, phrase: PHRASE_ROUNDS, listen: LISTEN_ROUNDS, story: STORY_ROUNDS });
        if (!hasOwn(sources, mode)) return;
        const source = sources[mode];
        const suitable = source.filter(round => {
          const word = round.wordId && QUESTION_BY_ID[round.wordId];
          return state.progress.level === 'beginner' || state.progress.level === 'unsure' ? !word || word.band !== 'Stretch' : true;
        });
        rounds = rotatePractice(suitable, Math.min(['story', 'listen'].includes(mode) ? 4 : 5, suitable.length), mode);
      }
      if (!rounds.length) rounds = [makeSceneMiniRound(sampleForLevel(everydayQuestions(), 1)[0])];
      rounds = rounds.map(round => Array.isArray(round.options) ? { ...round, options: shuffled(round.options) } : round);
      state.session = null;
      state.toneSession = null;
      state.miniSession = { mode, rounds, index: 0, choice: null, correct: 0, answered: 0, results: [], draftAnswer: '', hintVisible: false, missedIds: [], finished: false };
      state.view = 'mini';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function currentMiniRound() {
      if (!state.miniSession || state.miniSession.index >= state.miniSession.rounds.length) return null;
      return state.miniSession.rounds[state.miniSession.index];
    }
    function isMiniAnswerCorrect(round, answer) {
      return round.type === 'recall'
        ? String(answer).trim().toLocaleLowerCase() === String(round.answer).trim().toLocaleLowerCase()
        : answer === round.answer;
    }
    function submitMiniAnswer(answer) {
      const session = state.miniSession;
      const round = currentMiniRound();
      if (!session || !round || session.choice !== null || session.finished) return;
      if (round.type === 'recall') answer = sanitizeUserText(answer, 100).trim();
      else if (!Array.isArray(round.options) || !round.options.includes(answer)) return;
      if (!answer) return;
      session.choice = answer;
      session.answered += 1;
      const correct = isMiniAnswerCorrect(round, answer);
      playAnswerChime(correct);
      if (correct) session.correct += 1;
      else if (!session.missedIds.includes(round.id)) session.missedIds.push(round.id);
      session.results.push({ id: round.id, choice: answer, correct });
      recordActivity(round.wordId ? QUESTION_BY_ID[round.wordId] : null, correct, round.type);
      render();
    }
    function advanceMiniGame() {
      const session = state.miniSession;
      if (!session || session.choice === null || session.finished) return;
      if (session.index + 1 >= session.rounds.length) {
        session.finished = true;
        state.view = 'mini-summary';
        markPracticeDay(session.mode === 'daily' ? 'daily' : session.mode === 'review' ? 'review' : session.mode);
      } else {
        session.index += 1;
        session.choice = null;
        session.draftAnswer = '';
        session.hintVisible = false;
      }
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function getReviewIds() {
      return [...new Set([...dueReviewIds(), ...state.progress.missedIds, ...state.progress.savedIds])];
    }
    function currentQuestion() {
      if (!state.session || state.session.index >= state.session.questions.length) return null;
      return state.session.questions[state.session.index];
    }
    function submitAnswer(answer) {
      const session = state.session;
      const question = currentQuestion();
      if (!session || !question || session.showingFeedback || session.finished || !question.options.includes(answer)) return;
      session.choice = answer;
      session.showingFeedback = true;
      session.answered += 1;
      const isCorrect = answer === question.answer;
      playAnswerChime(isCorrect);
      if (isCorrect) session.correct += 1;
      else if (!session.missedIds.includes(question.id)) session.missedIds.push(question.id);
      recordActivity(question, isCorrect);
      render();
    }
    function advanceSession() {
      const session = state.session;
      if (!session || !session.showingFeedback) return;
      if (session.index + 1 >= session.questions.length) {
        session.finished = true;
        state.view = 'summary';
        markPracticeDay(session.mode === 'review' ? 'review' : 'scene');
      } else {
        session.index += 1;
        session.choice = null;
        session.showingFeedback = false;
      }
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function toggleSaved(id) {
      if (!hasOwn(QUESTION_BY_ID, id)) return;
      const saved = state.progress.savedIds;
      const index = saved.indexOf(id);
      const isRemoving = index !== -1;
      if (isRemoving) {
        saved.splice(index, 1);
        if (state.progress.masteryLevels) delete state.progress.masteryLevels[id];
        if (state.progress.wordNotes) delete state.progress.wordNotes[id];
      } else {
        saved.push(id);
        if (!state.progress.masteryLevels) state.progress.masteryLevels = {};
        if (!state.progress.masteryLevels[id]) state.progress.masteryLevels[id] = 'Medium';
      }
      saveProgress();
      showToast(isRemoving ? 'Removed from your wordbook' : 'Saved to your wordbook');
    }
    function showToast(message) {
      toastEl.textContent = localizeCopy(message);
      toastEl.classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 2600);
    }
    function accentLabel(value = state.progress.accent) {
      return ACCENT_OPTIONS.find(option => option.value === value)?.label || 'US English';
    }
    function getSpeechSynthesis() {
      try { return window && window.speechSynthesis ? window.speechSynthesis : null; } catch (error) { return null; }
    }
    function getSpeechUtteranceConstructor() {
      try { return window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null); } catch (error) { return null; }
    }
    function speechSupported() { return Boolean(getSpeechSynthesis() && getSpeechUtteranceConstructor()); }
    function speechDisabledAttributes() { return speechSupported() ? '' : 'disabled aria-disabled="true" title="Speech playback is unavailable in this browser"'; }
    function speakerButton(word, extraClass = '') {
      const safeWord = escapeHtml(word);
      const label = accentLabel();
      const unavailable = !speechSupported();
      return `<button type="button" class="speaker-button ${extraClass}" data-action="speak-word" data-word="${safeWord}" aria-label="${unavailable ? 'Pronunciation is unavailable in this browser' : `Hear ${safeWord} in ${escapeHtml(label)}`}" title="${unavailable ? 'Speech playback is unavailable in this browser' : `Hear pronunciation in ${escapeHtml(label)}`}" ${speechDisabledAttributes()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 3V7l-4 3H4Z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11"/></svg></button>`;
    }
    let speechVoiceCache = [];
    function refreshSpeechVoices() {
      const synth = getSpeechSynthesis();
      try { speechVoiceCache = synth && typeof synth.getVoices === 'function' ? Array.from(synth.getVoices() || []) : []; }
      catch (error) { speechVoiceCache = []; }
    }
    function initializeSpeechVoices() {
      const synth = getSpeechSynthesis();
      if (!synth) return;
      refreshSpeechVoices();
      try {
        if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', refreshSpeechVoices);
        else synth.onvoiceschanged = refreshSpeechVoices;
      } catch (error) { /* Voice discovery can be unavailable even when speaking works. */ }
    }
    function normalizeSpeechLanguage(value) { return String(value || '').replace(/_/g, '-').toLowerCase(); }
    function speakWord(text, slow = false, requestedLanguage = null) {
      const synth = getSpeechSynthesis();
      const Utterance = getSpeechUtteranceConstructor();
      if (!synth || !Utterance) {
        showToast('Speech playback is not available in this browser.');
        return;
      }
      const accent = requestedLanguage || (ACCENT_OPTIONS.some(option => option.value === state.progress.accent) ? state.progress.accent : 'en-US');
      let voices = [];
      try { voices = typeof synth.getVoices === 'function' ? Array.from(synth.getVoices() || []) : []; } catch (error) { voices = []; }
      if (voices.length) speechVoiceCache = voices; else voices = speechVoiceCache.slice();
      const exact = voices.filter(voice => normalizeSpeechLanguage(voice.lang) === normalizeSpeechLanguage(accent));
      const googleVoice = exact.find(voice => /google/i.test(voice.name || ''));
      const generic = ['en-US', 'en-GB'].flatMap(language => voices.filter(voice => normalizeSpeechLanguage(voice.lang) === normalizeSpeechLanguage(language)));
      const baseLanguage = normalizeSpeechLanguage(accent).split('-')[0];
      const targetFallback = voices.find(voice => normalizeSpeechLanguage(voice.lang).split('-')[0] === baseLanguage) || null;
      const englishFallback = voices.find(voice => /^en[-_]/i.test(voice.lang || '')) || null;
      const voice = googleVoice || exact[0] || (baseLanguage === 'en' ? generic[0] : targetFallback) || targetFallback || englishFallback || voices.find(voice => voice.default) || null;
      let utterance;
      try { utterance = new Utterance(sanitizeUserText(text, 200)); }
      catch (error) { showToast('This device could not prepare the pronunciation.'); return; }
      try {
        utterance.lang = exact.length ? accent : (voice && voice.lang ? String(voice.lang).replace(/_/g, '-') : 'en-US');
        utterance.rate = slow ? 0.72 : 0.88;
        if (voice) utterance.voice = voice;
        utterance.onerror = () => showToast('This device could not play the pronunciation. Try another accent or browser.');
        if (typeof synth.cancel === 'function') synth.cancel();
        synth.speak(utterance);
      } catch (error) {
        showToast('This device could not play the pronunciation. Try another accent or browser.');
        return;
      }
      if (!exact.length && voices.length) {
        const used = voice ? `${voice.name || 'English voice'} (${voice.lang || 'English'})` : 'your device’s default voice';
        const selectedLabel = accentLabel(accent) !== 'US English' || accent === 'en-US' ? accentLabel(accent) : ({ 'es-ES':'Spanish', 'hi-IN':'Hindi', 'bn-BD':'Bangla', 'fr-FR':'French' })[accent] || String(accent);
        showToast(`No ${selectedLabel} voice found. Using ${used} instead.`);
      } else if (!voices.length) {
        showToast('Your device is choosing the closest available English voice.');
      }
    }
    function formatDate() {
      return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
    }
    function accuracy() {
      return state.progress.totalAnswered ? Math.round((state.progress.totalCorrect / state.progress.totalAnswered) * 100) : 0;
    }
    function envCompletion(envId) {
      const all = getEnvironmentQuestions(envId);
      const explored = all.filter(question => state.progress.exploredIds.includes(question.id)).length;
      return { explored, total: all.length, percent: all.length ? Math.round((explored / all.length) * 100) : 0 };
    }
    function renderWorldCard(env, detailed = false) {
      const completion = envCompletion(env.id);
      if (detailed) {
        return `<article class="explore-card">
          <div class="explore-card-top"><div class="world-icon" style="background:${env.color}" aria-hidden="true">${env.icon}</div><div><h2>${escapeHtml(env.name)}</h2><p>${escapeHtml(env.description)}</p></div></div>
          <div class="explore-card-bottom"><div class="scene-count"><strong>${completion.explored} / ${completion.total}</strong> scenes explored</div><button class="btn btn-quiet btn-small" data-action="start-env" data-env="${env.id}">Enter world ${iconArrow()}</button></div>
        </article>`;
      }
      return `<article class="world-card">
        <div class="world-icon" style="background:${env.color}" aria-hidden="true">${env.icon}</div>
        <h3>${escapeHtml(env.name)}</h3><p>${escapeHtml(env.short)}</p>
        <div class="world-progress-row"><span>Your trail</span><span>${completion.explored}/${completion.total}</span></div>
        <div class="mini-track" role="progressbar" aria-label="${escapeHtml(env.name)} progress" aria-valuenow="${completion.percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${completion.percent}%"></span></div>
        <button class="world-action" data-action="start-env" data-env="${env.id}"><span>Explore world</span><span aria-hidden="true">→</span></button>
      </article>`;
    }
    function renderWeekStrip() {
      const days = currentWeekDays();
      const completed = days.filter(day => day.active).length;
      const today = todayKey();
      const todayDone = state.progress.practiceDates.includes(today);
      return `<section class="week-card" aria-label="Practice days this week"><div class="week-copy"><div class="eyebrow">YOUR WEEK, AT YOUR PACE</div><h3>${completed} of 7 practice days</h3><p>${todayDone ? 'You practiced today. Come back whenever you like.' : 'A short session counts today. Take a day off whenever you need one.'} Your words stay learned.</p></div><div class="week-days">${days.map(day => `<div class="week-day ${day.active ? 'active' : ''} ${day.key === today ? 'is-today' : ''} ${day.future ? 'future' : ''}" aria-label="${escapeHtml(`${day.short} ${day.number}: ${day.active ? 'practiced' : day.future ? 'upcoming' : 'no practice'}`)}"><span>${escapeHtml(day.short)}</span><b aria-hidden="true">${day.active ? '✓' : day.number}</b></div>`).join('')}</div></section>`;
    }
    function renderGameCard(gameId, compact = false) {
      const game = GAME_INFO[gameId];
      const runs = state.progress.gameRuns[gameId] || 0;
      const action = gameId === 'scene' ? 'start-scene' : 'start-mini';
      return `<article class="game-card ${compact ? 'compact' : ''}" style="--game-tint:${game.color}"><div class="game-card-top"><span class="game-icon" aria-hidden="true">${game.icon}</span><span class="game-label">${game.label}</span></div><h3>${escapeHtml(game.name)}</h3><p>${escapeHtml(game.description)}</p><div class="game-goal"><strong>YOU’LL PRACTICE</strong><span>${escapeHtml(game.learning)}</span></div><div class="game-meta"><span>${escapeHtml(game.count)}</span><span>${runs} ${runs === 1 ? 'round' : 'rounds'} played</span></div><button class="game-play-button" data-action="${action}" ${gameId === 'scene' ? '' : `data-game="${gameId}"`}>${gameId === 'scene' ? 'Start a scene round' : `Try ${escapeHtml(game.name)}`} <span aria-hidden="true">→</span></button></article>`;
    }
    function renderOnboardingProgress(activeStep) {
      const languageState = activeStep === 'language' ? 'is-current' : 'is-complete';
      const levelState = activeStep === 'level' ? 'is-current' : '';
      return `<div class="onboarding-progress" role="group" aria-label="${escapeHtml(uiText('Setup progress'))}"><div class="onboarding-step ${languageState}" ${activeStep === 'language' ? 'aria-current="step"' : ''}><span class="onboarding-step-number">1</span><strong>${escapeHtml(uiText('Support language'))}</strong></div><span class="onboarding-step-connector" aria-hidden="true"></span><div class="onboarding-step ${levelState}" ${activeStep === 'level' ? 'aria-current="step"' : ''}><span class="onboarding-step-number">2</span><strong>${escapeHtml(uiText('English level'))}</strong></div></div>`;
    }
    function renderOnboarding() {
      const activeStep = state.onboardingStep === 'level' ? 'level' : 'language';
      const language = ONBOARDING_LANGUAGES.find(option => option.code === state.onboardingLanguage) || null;
      if (activeStep === 'language') {
        const hintControl = language && language.code !== 'en'
          ? `<label class="onboarding-gloss"><input id="onboarding-gloss-toggle" type="checkbox"><span><strong>${escapeHtml(uiText('Show translated word hints'))}</strong><small>${escapeHtml(uiText('Optional: show short meanings for English words in this language. Change this anytime in Settings.'))}</small></span></label>`
          : language
            ? `<p class="onboarding-language-note">${escapeHtml(uiText('English selected. App instructions and word hints will stay in English.'))}</p>`
            : `<p class="onboarding-language-note">${escapeHtml(uiText('Choose a support language to set the language for word hints.'))}</p>`;
        return `<div class="page onboarding-page">${renderOnboardingProgress(activeStep)}<div class="eyebrow">${escapeHtml(uiText('STEP 1 OF 2 · SUPPORT LANGUAGE'))}</div><h1>${escapeHtml(uiText('Which language would you like to use?'))}</h1><p class="onboarding-intro">${escapeHtml(uiText('Choose one support language. It sets the app instructions and the language for optional word meanings. English practice stays in English.'))}</p><div class="language-choice-grid" role="group" aria-label="${escapeHtml(uiText('Support language'))}">${ONBOARDING_LANGUAGES.map(option => {
          const selected = option.code === state.onboardingLanguage;
          return `<button type="button" class="language-option${selected ? ' is-selected' : ''}" data-action="select-onboarding-language" data-language="${option.code}" aria-label="${escapeHtml(`${option.native} — ${option.key}`)}" aria-pressed="${selected}"><span class="language-option-heading"><span class="language-option-native">${escapeHtml(option.native)}</span><span class="language-option-check" aria-hidden="true">${selected ? '✓' : ''}</span></span><span class="language-option-name">${escapeHtml(option.key)}</span></button>`;
        }).join('')}</div>${hintControl}<p class="onboarding-language-note">${escapeHtml(uiText('You can change your support language anytime in Settings.'))}</p><div class="onboarding-action-row"><button type="button" class="btn btn-primary onboarding-next" data-action="continue-onboarding-language" ${language ? '' : 'disabled'}>${escapeHtml(uiText('Continue to English level'))} ${iconArrow()}</button></div></div>`;
      }
      const order = ['beginner', 'intermediate', 'advanced', 'unsure'];
      const selectedLevel = Object.prototype.hasOwnProperty.call(LEVELS, state.onboardingLevel) ? state.onboardingLevel : null;
      const languageSummary = language ? `${language.native} · ${language.key}` : uiText('English');
      return `<div class="page onboarding-page">${renderOnboardingProgress(activeStep)}<div class="eyebrow">${escapeHtml(uiText('STEP 2 OF 2 · ENGLISH LEVEL'))}</div><h1>${escapeHtml(uiText('How comfortable are you with English?'))}</h1><p class="onboarding-intro">${escapeHtml(uiText('Choose the description that feels closest. This is not a test. Pick what sounds right today; you can change this later.'))}</p><div class="level-grid" role="group" aria-label="${escapeHtml(uiText('English level'))}">${order.map(level => {
        const info = LEVELS[level];
        const selected = selectedLevel === level;
        return `<button type="button" class="level-option${selected ? ' is-selected' : ''}" data-action="select-onboarding-level" data-level="${level}" aria-pressed="${selected}"><span class="level-option-top"><span class="level-name">${escapeHtml(uiText(info.label))}</span><span class="level-step" aria-hidden="true">${selected ? '✓' : '○'}</span></span><strong>${escapeHtml(uiText(info.title))}</strong><span class="level-description">${escapeHtml(uiText(info.description))}</span></button>`;
      }).join('')}</div><div class="onboarding-language-summary"><div><span class="onboarding-language-summary-label">${escapeHtml(uiText('Your support language'))}</span><strong>${escapeHtml(languageSummary)}</strong></div><button type="button" class="onboarding-language-edit" data-action="edit-onboarding-language">${escapeHtml(uiText('Change support language'))}</button></div><p class="level-footnote">${escapeHtml(uiText('Your level only guides the first words and round. It is not a score.'))}</p><div class="onboarding-action-row">${state.progress.level ? `<button type="button" class="onboarding-back" data-view="home">${escapeHtml(uiText('Keep my current level and return home'))}</button>` : ''}<button type="button" class="btn btn-primary onboarding-next" data-action="complete-onboarding" ${selectedLevel ? '' : 'disabled'}>${escapeHtml(uiText('Start my first lesson'))} ${iconArrow()}</button></div></div>`;
    }
    function renderHome() {
      const reviewCount = dueReviewIds().length;
      const reviewTargets = getReviewIds().length;
      const activeScene = state.session && !state.session.finished && state.session.index < state.session.questions.length;
      const activeMini = state.miniSession && !state.miniSession.finished && state.miniSession.index < state.miniSession.rounds.length;
      const activeTone = state.toneSession && !state.toneSession.finished;
      const resume = Boolean(activeMini || activeScene || activeTone);
      const resumeMini = Boolean(activeMini);
      const level = LEVELS[state.progress.level] || LEVELS.beginner;
      const path = recommendedLesson();
      const env = getEnvironment(path.env);
      const resumeName = resumeMini ? (state.miniSession.mode === 'daily' ? 'your four-part sampler' : state.miniSession.mode === 'review' ? 'your word review' : `your ${GAME_INFO[state.miniSession.mode]?.name || 'practice'} round`) : state.session ? (state.session.mode === 'environment' || state.session.mode === 'starter' ? `your ${getEnvironment(state.session.envId).name} round` : 'your scene round') : 'your Tone Shift round';
      const levelDescription = state.progress.level === 'unsure' ? 'beginner-friendly' : level.label.toLowerCase();
      const description = resume ? `Pick up ${resumeName} when you are ready. Your place is kept while you browse.` : `A short ${levelDescription} round in ${env.name}, focused on ${path.goal}. Five questions, with no timer.`;
      const gentleNote = resume ? 'Your place is kept while you browse; starting another round replaces it.' : 'No countdown and no streak requirement. Stop whenever you need.';
      const levelBadge = state.progress.level === 'unsure' ? 'Everyday starter' : `${level.label} starting level`;
      const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
      return `<div class="page home-page">
        <div class="welcome-row"><div><div class="eyebrow">${greeting} · ${formatDate()}</div><h1>English for everyday moments.</h1><p>Learn common words through short situations, and see when similar words do not quite fit.</p></div><div class="day-pill"><span class="dot"></span>${escapeHtml(levelBadge)}</div></div>
        <section class="hero-card" aria-label="Your recommended next lesson">
          <div class="hero-copy"><div class="hero-tag">${resume ? 'ROUND IN PROGRESS' : path.phase ? `GUIDED LESSON ${path.phase} OF ${path.total}` : 'VARIED PRACTICE'}</div><h2>${resume ? 'Continue when you’re ready.' : `Start with ${escapeHtml(env.name)}.`}</h2><p>${description}</p><button class="btn btn-primary" data-action="${resume ? 'resume-session' : 'start-recommended'}">${resume ? 'Continue this round' : 'Start a 5-question lesson'} ${iconArrow()}</button><button class="hero-secondary" data-view="games">Choose a different activity</button><div class="gentle-note">${gentleNote}</div></div>
          <div class="hero-art lesson-steps" aria-label="Read a scene, choose a word, learn why it fits"><div class="lesson-step"><span>1</span>Read a scene</div><div class="lesson-connector" aria-hidden="true"></div><div class="lesson-step"><span>2</span>Choose a word</div><div class="lesson-connector" aria-hidden="true"></div><div class="lesson-step"><span>3</span>See why it fits</div></div>
        </section>
        <div class="stats-grid" aria-label="Your learning statistics">
          <div class="stat-card"><div><div class="stat-title">Words explored</div><div class="stat-value">${state.progress.exploredIds.length}</div></div><div class="stat-icon" aria-hidden="true">✦</div></div>
          <div class="stat-card"><div><div class="stat-title">Answer accuracy</div><div class="stat-value">${accuracy()}<span class="stat-suffix">%</span></div></div><div class="stat-icon" aria-hidden="true">◎</div></div>
          <div class="stat-card"><div><div class="stat-title">Practice streak</div><div class="stat-value">${currentPracticeStreak()}<span class="stat-suffix"> days</span></div></div><div class="stat-icon" aria-hidden="true">✦</div></div>
        </div>
        ${renderWeekStrip()}
        <section class="home-games" aria-labelledby="practice-preview-title"><div class="section-heading"><div><h2 id="practice-preview-title">Want to focus on a skill?</h2><p>Practice context, similar words, opposites, phrases, listening, or short stories.</p></div><button class="text-button" data-view="games">Choose a practice type →</button></div><div class="skill-chips" aria-label="Available practice goals"><span>Word in context</span><span>Similar meaning</span><span>Opposite meaning</span><span>Natural phrases</span><span>Listening</span><span>Short stories</span><span>Type from memory</span></div></section>
        <div class="lower-grid">
          <article class="feature-card"><div><div class="eyebrow">WORD REVIEW</div><h3>${reviewCount ? `${reviewCount} word${reviewCount === 1 ? '' : 's'} due to revisit` : reviewTargets ? 'Your review queue is ready' : 'Save words you want to keep'}</h3><p>${reviewCount ? 'Try to recall each word before reading its explanation. Missed words return sooner; correct answers are spaced out.' : reviewTargets ? 'Your saved words are here when you want an extra practice round.' : 'Save words from a question and find their meaning and examples here.'}</p><button class="btn btn-quiet btn-small" ${reviewTargets ? 'data-action="start-review"' : 'data-view="wordbook"'}>${reviewCount ? 'Review due words' : reviewTargets ? 'Open review queue' : 'Open my wordbook'} ${iconArrow()}</button></div><div class="feature-symbol" aria-hidden="true">📖</div></article>
          <article class="feature-card tone-feature"><div><div class="eyebrow">FIVE SETTINGS</div><h3>Practice in a place</h3><p>Use vocabulary from home, campus, the market, work, or travel.</p><button class="btn btn-light btn-small" data-view="explore">Browse settings ${iconArrow()}</button></div><div class="feature-symbol" aria-hidden="true">🧭</div></article>
        </div>
      </div>`;
    }
    function renderGames() {
      const dailyRuns = state.progress.gameRuns.daily || 0;
      // An optional suggestion only appears after enough attempts to be meaningful.
      const focus = ['synonym', 'antonym', 'phrase', 'listen', 'story', 'recall']
        .map(id => ({ id, stats: state.progress.gameStats[id] || { answered: 0, correct: 0 } }))
        .filter(item => item.stats.answered >= 3)
        .sort((a, b) => a.stats.correct / a.stats.answered - b.stats.correct / b.stats.answered)[0];
      const suggestion = focus && focus.stats.correct < focus.stats.answered
        ? `<aside class="skill-suggestion" aria-label="Optional practice suggestion"><div><strong>Want another try at ${escapeHtml(GAME_INFO[focus.id].name)}?</strong><p>You have practiced this skill before. Another short round can help you notice the distinction.</p></div><button class="btn btn-outline btn-small" data-action="start-mini" data-game="${focus.id}">Practice this skill ${iconArrow()}</button></aside>` : '';
      return `<div class="page"><header class="page-header"><div class="eyebrow">PRACTICE · NO TIMER</div><h1>What would you like to practice?</h1><p>Each activity has one clear goal. Choose a short round; you can switch activities whenever you like.</p></header>${suggestion}
        <section class="sampler-card"><div><div class="eyebrow">NOT SURE? START WITH THIS</div><h2>Try four different skills.</h2><p>Four changing activities drawn from context, similar words, opposites, phrases, listening, stories, and typed recall. When a word is due, one turn helps you remember it.</p><button class="btn btn-primary btn-small" data-action="start-daily-mix">Start the four-part sampler ${iconArrow()}</button></div><div class="sampler-steps" aria-hidden="true"><span>Choose</span><b>+</b><span>Listen</span><b>+</b><span>Read</span><b>+</b><span>Recall</span></div><div class="sampler-played">${dailyRuns} sampler${dailyRuns === 1 ? '' : 's'} completed</div></section>
        <section class="practice-section"><div class="section-heading"><div><h2>Words and phrases</h2><p>Choose a word goal before you start.</p></div></div><div class="game-grid">${['scene','synonym','antonym','phrase'].map(gameId => renderGameCard(gameId)).join('')}</div></section>
        <section class="practice-section"><div class="section-heading"><div><h2>Listen, read, and recall</h2><p>Hear a word, read a short situation, or retrieve a word from memory.</p></div></div><div class="game-grid learning-grid">${['listen','story','recall','usage'].map(gameId => renderGameCard(gameId)).join('')}</div><p class="voice-note"><strong>Pronunciation:</strong> Choose an accent in the top bar. Audio uses the browser’s speech engine and available English voices; if the exact accent is unavailable, the app will tell you which voice it uses instead. A Google-named voice is preferred when your device provides one. This standalone app is not connected to Google Cloud Text-to-Speech.</p></section>
        <div class="tone-cta"><div><h3>Choose words for the situation</h3><p>Tone Shift helps you practice a warmer, clearer, or more formal message for a friend, teammate, or teacher.</p></div><button class="btn btn-light btn-small" data-action="start-tone">Try Tone Shift ${iconArrow()}</button></div>
        <p class="gentle-footer">Your streak is a record, not a requirement. Missing a day never removes words or progress.</p></div>`;
    }
    function renderExplore() {
      return `<div class="page"><header class="page-header"><div class="eyebrow">CHOOSE YOUR SETTING</div><h1>Practice words in five settings.</h1><p>Choose a place. Each round gives a short scene, one clear clue, and an explanation of why the word fits.</p></header><div class="explore-grid">${ENVIRONMENTS.map(env => renderWorldCard(env, true)).join('')}</div><div class="tone-cta" style="margin-top:19px"><div><h3>Want to practice how a message feels?</h3><p>Try Tone Shift: small word choices can make a request sound warmer, clearer, or more formal.</p></div><button class="btn btn-light btn-small" data-action="start-tone">Open Tone Shift ${iconArrow()}</button></div></div>`;
    }
    function renderNuance() {
      const keys = Object.keys(NUANCE_SETS);
      const selectedKey = hasOwn(NUANCE_SETS, state.nuanceFamily) ? state.nuanceFamily : keys[0];
      const set = NUANCE_SETS[selectedKey];
      const selected = state.selectedNuanceWord;
      return `<div class="page"><header class="page-header"><div class="eyebrow">THE NUANCE LAB</div><h1>Compare similar words.</h1><p>Check meaning, strength, formality, and typical use. A synonym may share the idea but still sound wrong in a particular situation.</p></header>
        <div class="nuance-layout"><aside class="family-panel" aria-label="Word groups"><span class="eyebrow">WORD GROUPS</span>${keys.map(key => `<button class="family-button ${key === selectedKey ? 'active' : ''}" data-action="nuance-family" data-family="${key}" aria-pressed="${key === selectedKey}"><span>${escapeHtml(NUANCE_SETS[key].label)}</span><span aria-hidden="true">›</span></button>`).join('')}</aside>
        <div class="nuance-content"><section class="nuance-feature"><div class="eyebrow">A CLOSER LOOK</div><h2>${escapeHtml(set.title)}</h2><p>${escapeHtml(set.description)}</p><div class="nuance-note">✦ &nbsp;${escapeHtml(set.note)}</div></section>
        <div class="nuance-cards">${set.words.map(item => `<article class="nuance-word-card ${selected === item.word ? 'selected' : ''}"><div class="nuance-word-top"><button class="nuance-term-button" data-action="select-nuance-word" data-word="${escapeHtml(item.word)}" aria-pressed="${selected === item.word}"><h3>${escapeHtml(item.word)}</h3></button><span class="nuance-word-tools">${speakerButton(item.word)}<span class="word-tag">${escapeHtml(item.tag)}</span></span></div><p>${escapeHtml(item.detail)}</p><p class="word-example"><strong>Example:</strong> “${escapeHtml(item.example)}”</p></article>`).join('')}</div>
        <div class="tone-cta"><div><h3>Now try choosing by context</h3><p>Try a varied sampler and see how word choices work in real situations.</p></div><button class="btn btn-light btn-small" data-action="start-daily-mix">Play the sampler ${iconArrow()}</button></div></div></div></div>`;
    }
    function renderWordCard(question, isSaved, isMissed, isDue = false) {
      const env = getEnvironment(question.env);
      const mastery = state.progress.masteryLevels && state.progress.masteryLevels[question.id];
      const status = isMissed ? '<span class="review-flag">Missed last time</span>' : isDue ? '<span class="review-flag">Due for review</span>' : isSaved && mastery ? `<span class="mastery-tag">${escapeHtml(mastery)}</span>` : `<span class="word-tag">${escapeHtml(env.name)}</span>`;
      const note = state.progress.wordNotes && state.progress.wordNotes[question.id] || '';
      const notePanel = `<details class="word-note"><summary>Personal note${note ? ' · saved' : ''}</summary><form class="word-note-form" data-id="${question.id}"><label>Your note for “${escapeHtml(question.answer)}”<textarea class="word-note-input" maxlength="500">${escapeHtml(note)}</textarea></label><button class="btn btn-outline btn-small" type="submit">Save note</button></form></details>`;
      return `<article class="saved-word-card"><div class="saved-word-heading"><div><div class="saved-word-title"><h3>${escapeHtml(question.answer)}</h3>${speakerButton(question.answer)}</div><div class="word-context">${escapeHtml(question.family)} · ${escapeHtml(env.name)}</div></div>${status}</div><p>${escapeHtml(question.definition)} ${escapeHtml(question.nuance)}</p>${renderGlossLine(question.id)}<div class="related-row"><strong>Near-synonyms:</strong> ${(RELATED_WORDS[question.id] || []).map(word => `<span class="related-chip">${escapeHtml(word)}</span>`).join('')}</div><div class="related-row"><strong>Opposites:</strong> ${(ANTONYMS[question.id] || []).map(word => `<span class="related-chip opposite-chip">${escapeHtml(word)}</span>`).join('')}</div><blockquote style="margin-top:11px">“${escapeHtml(question.example)}”</blockquote>${notePanel}<div class="saved-word-actions"><button class="text-button" data-action="start-review-one" data-id="${question.id}">Practice this word →</button><button class="save-word-button" data-action="toggle-saved" data-id="${question.id}" aria-label="${isSaved ? 'Remove' : 'Save'} ${escapeHtml(question.answer)}">${isSaved ? '♥ Saved' : '♡ Save'}</button></div></article>`;
    }
    const ACADEMY_UI_TRANSLATIONS = {
      es: {
        'Academy':'Academia','Class':'Clase','Choose a class':'Elige una clase','Choose another class':'Elegir otra clase','Curriculum map':'Mapa curricular','Practice tests':'Pruebas de práctica','Writing bank':'Banco de redacción','My Wordbook':'Mi vocabulario','Open section':'Abrir sección','Back to class':'Volver al curso','Official NCTB 2026 book listing':'Listado oficial de libros NCTB 2026','SSC 2026 assessment notice':'Aviso de evaluación SSC 2026','All tasks':'Todas las tareas','Paragraphs':'Párrafos','Dialogues':'Diálogos','Letters & emails':'Cartas y correos','Compositions':'Composiciones','Story completion':'Completar historias','Applications':'Solicitudes','Read model answer':'Leer respuesta modelo','Bangla guidance':'Orientación en bangla','Prompt':'Consigna','Check answer':'Ver respuesta','Open model answer':'Abrir respuesta modelo','Back to Academy':'Volver a la Academia','curriculum topics':'temas curriculares','model answers':'respuestas modelo','practice sets':'conjuntos de práctica','original model answers':'respuestas modelo originales','Sources':'Fuentes','topics':'temas','Open wordbook':'Abrir mi vocabulario','Writing task':'Tarea de escritura','Reading passage':'Texto de lectura','curriculum topics':'temas curriculares','practice-format note':'nota sobre el formato de práctica','Practice-format note':'Nota sobre el formato de práctica','Use this as a model; adapt it in your own words.':'Úsalo como modelo y adáptalo con tus palabras.','No answers in this category.':'No hay respuestas en esta categoría.','Choose another writing filter to browse this class.':'Elige otro filtro para ver más textos de esta clase.','Filter writing tasks':'Filtrar tareas de escritura','model answers':'respuestas modelo','curriculum topics':'temas curriculares','practice sets':'conjuntos de práctica','NCTB 2026 · general Bangla-medium':'NCTB 2026 · currículo general en bangla','Choose a class to browse textbook themes and practice.':'Elige un curso para explorar temas y práctica del libro.','English answers · concise Bangla writing support':'Respuestas en inglés · apoyo breve de escritura en bangla','Original practice; not an official paper.':'Práctica original; no es un examen oficial.','Textbook-mapped practice':'Práctica basada en el libro','English-medium is planned for a later release.':'La versión en inglés se añadirá más adelante.','Study the textbook themes and language skills.':'Estudia los temas del libro y las destrezas lingüísticas.','Original, syllabus-mapped practice sets.':'Ejercicios originales alineados con el temario.','Model answers with short Bangla support.':'Respuestas modelo con apoyo breve en bangla.','Saved words, notes, and review stay unchanged.':'Tus palabras, notas y repasos se conservan.', "2026 NCTB textbook list":"Lista de libros de texto NCTB 2026", "Prescribed English books":"Libros de inglés prescritos", "Language skills":"Habilidades lingüísticas", "Writing practice":"Práctica de escritura", "Written forms":"Tipos de texto escrito", "SSC 2026 writing structure":"Estructura de escritura SSC 2026", "SSC 2026 assessment reference":"Referencia de evaluación SSC 2026", "Paper 1 writing: story completion (15) + dialogue (15). Paper 2: Grammar (60) + Writing (40), with paragraph (10) + email/letter/application (10) + short composition (20). Practice sets are not official papers.":"English 1st Paper, escritura: completar una historia (15) y escribir un diálogo (15). English 2nd Paper: Grammar (60) + Writing (40), con párrafo (10), email/carta/solicitud (10) y composición breve (20). Son ejercicios, no exámenes oficiales.", "Classes 6–8 use textbook-mapped practice. School term plans can vary; this page does not claim one national paper pattern.":"En las clases 6–8, la práctica sigue los temas del libro. Los planes escolares varían; aquí no se afirma que exista un único formato nacional de examen.", "Classes 9–10 follow the SSC 2026 English structure: English 1st Paper Writing 30 (story completion 15 + dialogue 15); English 2nd Paper Grammar 60 + Writing 40 (paragraph 10, email/letter/application 10, short composition 20).":"Las clases 9–10 siguen la estructura SSC 2026: English 1st Paper, Writing 30 (historia 15 + diálogo 15); English 2nd Paper, Grammar 60 + Writing 40 (párrafo 10, email/carta/solicitud 10, composición breve 20).", "For Classes 6–8, use the selected textbook, school plan, and these practice tasks together. The Academy does not present a single national exam blueprint for these grades.":"En las clases 6–8, combina el libro elegido, el plan escolar y estos ejercicios. Academy no presenta un único modelo nacional de examen para estos cursos.", "SSC 2026 marks are shown for the relevant writing sections. These are original practice sets, not official NCTB or board question papers.":"Se indican los puntos SSC 2026 de las secciones de escritura pertinentes. Son ejercicios originales, no exámenes oficiales de NCTB ni de la junta educativa.", "These original reading, language, and writing sets are mapped to textbook themes. They do not claim an official national marks distribution or term-paper pattern.":"Estos ejercicios originales de lectura, lengua y escritura siguen los temas del libro. No afirman un reparto nacional oficial de puntos ni un formato único de examen escolar.", "Class 6 lessons are grouped by theme for easier revision.":"Las lecciones de 6.º se agrupan por temas para facilitar el repaso.", "This study map summarises themes; follow the printed book for full lesson text.":"Este mapa resume los temas; consulta el libro impreso para leer las lecciones completas."
      },
      fr: {
        'Academy':'Académie','Class':'Classe','Choose a class':'Choisir une classe','Choose another class':'Choisir une autre classe','Curriculum map':'Carte du programme','Practice tests':'Tests d’entraînement','Writing bank':'Banque de rédaction','My Wordbook':'Mon vocabulaire','Open section':'Ouvrir la section','Back to class':'Retour à la classe','Official NCTB 2026 book listing':'Liste officielle des manuels NCTB 2026','SSC 2026 assessment notice':'Avis d’évaluation SSC 2026','All tasks':'Toutes les tâches','Paragraphs':'Paragraphes','Dialogues':'Dialogues','Letters & emails':'Lettres et e-mails','Compositions':'Rédactions','Story completion':'Récits à compléter','Applications':'Demandes','Read model answer':'Lire la réponse modèle','Bangla guidance':'Conseil en bangla','Prompt':'Consigne','Check answer':'Voir la réponse','Open model answer':'Ouvrir la réponse modèle','Back to Academy':'Retour à l’Académie','curriculum topics':'thèmes du programme','model answers':'réponses modèles','practice sets':'séries d’entraînement','original model answers':'réponses modèles originales','Sources':'Sources','topics':'thèmes','Open wordbook':'Ouvrir mon vocabulaire','Writing task':'Tâche d’écriture','Reading passage':'Texte de lecture','Use this as a model; adapt it in your own words.':'Utilisez ce modèle et adaptez-le avec vos mots.','No answers in this category.':'Aucune réponse dans cette catégorie.','Choose another writing filter to browse this class.':'Choisissez un autre filtre pour voir les textes de cette classe.','Filter writing tasks':'Filtrer les tâches d’écriture','NCTB 2026 · general Bangla-medium':'NCTB 2026 · cursus général en bangla','Choose a class to browse textbook themes and practice.':'Choisissez une classe pour parcourir les thèmes et les exercices.','English answers · concise Bangla writing support':'Réponses en anglais · conseils brefs en bangla','Original practice; not an official paper.':'Exercice original ; ce n’est pas un sujet officiel.','Textbook-mapped practice':'Exercice lié au manuel','English-medium is planned for a later release.':'La version en anglais viendra plus tard.','Study the textbook themes and language skills.':'Étudiez les thèmes du manuel et les compétences linguistiques.','Original, syllabus-mapped practice sets.':'Exercices originaux liés au programme.','Model answers with short Bangla support.':'Réponses modèles avec un bref soutien en bangla.','Saved words, notes, and review stay unchanged.':'Vos mots, notes et révisions sont conservés.', "2026 NCTB textbook list":"Liste des manuels NCTB 2026", "Prescribed English books":"Manuels d’anglais prescrits", "Language skills":"Compétences linguistiques", "Writing practice":"Exercices d’expression écrite", "Written forms":"Types de textes écrits", "SSC 2026 writing structure":"Structure d’écriture SSC 2026", "SSC 2026 assessment reference":"Référence d’évaluation SSC 2026", "Paper 1 writing: story completion (15) + dialogue (15). Paper 2: Grammar (60) + Writing (40), with paragraph (10) + email/letter/application (10) + short composition (20). Practice sets are not official papers.":"English 1st Paper, écriture : récit à compléter (15) et dialogue (15). English 2nd Paper : Grammar (60) + Writing (40), avec paragraphe (10), e-mail/lettre/demande (10) et composition courte (20). Ce sont des exercices, pas des sujets officiels.", "Classes 6–8 use textbook-mapped practice. School term plans can vary; this page does not claim one national paper pattern.":"En classes 6 à 8, les exercices suivent les thèmes du manuel. Les plans scolaires varient ; cette page ne prétend pas établir un format national unique.", "Classes 9–10 follow the SSC 2026 English structure: English 1st Paper Writing 30 (story completion 15 + dialogue 15); English 2nd Paper Grammar 60 + Writing 40 (paragraph 10, email/letter/application 10, short composition 20).":"Les classes 9–10 suivent la structure SSC 2026 : English 1st Paper, Writing 30 (récit 15 + dialogue 15) ; English 2nd Paper, Grammar 60 + Writing 40 (paragraphe 10, e-mail/lettre/demande 10, composition courte 20).", "For Classes 6–8, use the selected textbook, school plan, and these practice tasks together. The Academy does not present a single national exam blueprint for these grades.":"Pour les classes 6 à 8, combinez le manuel choisi, le plan scolaire et ces exercices. Academy ne présente pas de modèle national unique pour ces classes.", "SSC 2026 marks are shown for the relevant writing sections. These are original practice sets, not official NCTB or board question papers.":"Les points SSC 2026 sont indiqués pour les sections d’écriture concernées. Ce sont des exercices originaux, pas des sujets officiels du NCTB ou du jury.", "These original reading, language, and writing sets are mapped to textbook themes. They do not claim an official national marks distribution or term-paper pattern.":"Ces exercices originaux de lecture, de langue et d’écriture suivent les thèmes du manuel. Ils ne prétendent pas établir un barème national officiel ni un format de composition scolaire unique.", "Class 6 lessons are grouped by theme for easier revision.":"Les leçons de 6e sont regroupées par thème pour faciliter les révisions.", "This study map summarises themes; follow the printed book for full lesson text.":"Cette carte résume les thèmes ; consultez le manuel imprimé pour le texte complet des leçons."
      },
      hi: {
        'Academy':'अकादमी','Class':'कक्षा','Choose a class':'कक्षा चुनें','Choose another class':'दूसरी कक्षा चुनें','Curriculum map':'पाठ्यक्रम मानचित्र','Practice tests':'अभ्यास प्रश्नपत्र','Writing bank':'लेखन संग्रह','My Wordbook':'मेरी शब्द-पुस्तिका','Open section':'अनुभाग खोलें','Back to class':'कक्षा पर लौटें','Official NCTB 2026 book listing':'NCTB 2026 की आधिकारिक पुस्तक सूची','SSC 2026 assessment notice':'SSC 2026 मूल्यांकन सूचना','All tasks':'सभी कार्य','Paragraphs':'अनुच्छेद','Dialogues':'संवाद','Letters & emails':'पत्र और ईमेल','Compositions':'निबंध','Story completion':'कहानी पूरी करें','Applications':'आवेदन','Read model answer':'नमूना उत्तर पढ़ें','Bangla guidance':'बांग्ला मार्गदर्शन','Prompt':'प्रश्न','Check answer':'उत्तर देखें','Open model answer':'नमूना उत्तर खोलें','Back to Academy':'अकादमी पर लौटें','curriculum topics':'पाठ्यक्रम विषय','model answers':'नमूना उत्तर','practice sets':'अभ्यास सेट','original model answers':'मौलिक नमूना उत्तर','Sources':'स्रोत','topics':'विषय','Open wordbook':'शब्द-पुस्तिका खोलें','Writing task':'लेखन कार्य','Reading passage':'पठन अंश','Use this as a model; adapt it in your own words.':'इसे नमूना मानें और अपने शब्दों में लिखें।','No answers in this category.':'इस श्रेणी में उत्तर नहीं हैं।','Choose another writing filter to browse this class.':'इस कक्षा के अन्य लेखन देखने के लिए दूसरा फ़िल्टर चुनें।','Filter writing tasks':'लेखन कार्य छाँटें','NCTB 2026 · general Bangla-medium':'NCTB 2026 · सामान्य बांग्ला माध्यम','Choose a class to browse textbook themes and practice.':'पुस्तक के विषय और अभ्यास देखने के लिए कक्षा चुनें।','English answers · concise Bangla writing support':'अंग्रेज़ी उत्तर · संक्षिप्त बांग्ला लेखन सहायता','Original practice; not an official paper.':'मौलिक अभ्यास; आधिकारिक प्रश्नपत्र नहीं।','Textbook-mapped practice':'पुस्तक-आधारित अभ्यास','English-medium is planned for a later release.':'अंग्रेज़ी माध्यम बाद में जोड़ा जाएगा।','Study the textbook themes and language skills.':'पुस्तक के विषय और भाषा-कौशल पढ़ें।','Original, syllabus-mapped practice sets.':'पाठ्यक्रम से जुड़े मौलिक अभ्यास।','Model answers with short Bangla support.':'संक्षिप्त बांग्ला सहायता सहित नमूना उत्तर।','Saved words, notes, and review stay unchanged.':'सहेजे शब्द, नोट्स और दोहराव सुरक्षित रहेंगे।', "2026 NCTB textbook list":"NCTB 2026 की पाठ्यपुस्तक सूची", "Prescribed English books":"निर्धारित अंग्रेज़ी पुस्तकें", "Language skills":"भाषा कौशल", "Writing practice":"लेखन अभ्यास", "Written forms":"लेखन के प्रकार", "SSC 2026 writing structure":"SSC 2026 लेखन संरचना", "SSC 2026 assessment reference":"SSC 2026 मूल्यांकन संदर्भ", "Paper 1 writing: story completion (15) + dialogue (15). Paper 2: Grammar (60) + Writing (40), with paragraph (10) + email/letter/application (10) + short composition (20). Practice sets are not official papers.":"English 1st Paper लेखन: कहानी पूरी करना (15) और संवाद लिखना (15)। English 2nd Paper: Grammar (60) + Writing (40), जिसमें अनुच्छेद (10), ईमेल/पत्र/आवेदन (10) और लघु रचना (20) हैं। ये अभ्यास हैं, आधिकारिक प्रश्नपत्र नहीं।", "Classes 6–8 use textbook-mapped practice. School term plans can vary; this page does not claim one national paper pattern.":"कक्षा 6–8 का अभ्यास पाठ्यपुस्तक के विषयों पर आधारित है। स्कूल की परीक्षाएँ अलग हो सकती हैं; यहाँ किसी एक राष्ट्रीय प्रश्नपत्र-पद्धति का दावा नहीं है।", "Classes 9–10 follow the SSC 2026 English structure: English 1st Paper Writing 30 (story completion 15 + dialogue 15); English 2nd Paper Grammar 60 + Writing 40 (paragraph 10, email/letter/application 10, short composition 20).":"कक्षा 9–10 में SSC 2026 संरचना लागू है: English 1st Paper Writing 30 (कहानी 15 + संवाद 15); English 2nd Paper Grammar 60 + Writing 40 (अनुच्छेद 10, ईमेल/पत्र/आवेदन 10, लघु रचना 20)।", "For Classes 6–8, use the selected textbook, school plan, and these practice tasks together. The Academy does not present a single national exam blueprint for these grades.":"कक्षा 6–8 के लिए चुनी हुई पुस्तक, स्कूल की योजना और इन अभ्यासों का साथ में उपयोग करें। Academy इन कक्षाओं के लिए एक राष्ट्रीय परीक्षा-ढाँचे का दावा नहीं करती।", "SSC 2026 marks are shown for the relevant writing sections. These are original practice sets, not official NCTB or board question papers.":"संबंधित लेखन भागों के SSC 2026 अंक दिखाए गए हैं। ये मौलिक अभ्यास हैं, NCTB या बोर्ड के आधिकारिक प्रश्नपत्र नहीं।", "These original reading, language, and writing sets are mapped to textbook themes. They do not claim an official national marks distribution or term-paper pattern.":"ये मौलिक पठन, भाषा और लेखन अभ्यास पाठ्यपुस्तक के विषयों पर आधारित हैं। ये किसी आधिकारिक राष्ट्रीय अंक-वितरण या स्कूल परीक्षा-पद्धति का दावा नहीं करते।", "Class 6 lessons are grouped by theme for easier revision.":"कक्षा 6 के पाठ आसान पुनरावृत्ति के लिए विषयों में बाँटे गए हैं।", "This study map summarises themes; follow the printed book for full lesson text.":"यह अध्ययन मानचित्र विषयों का सार देता है; पूरे पाठ के लिए मुद्रित पुस्तक देखें।"
      },
      bn: {
        'Academy':'একাডেমি','Class':'শ্রেণি','Choose a class':'শ্রেণি বেছে নিন','Choose another class':'অন্য শ্রেণি বেছে নিন','Curriculum map':'পাঠ্যক্রমের মানচিত্র','Practice tests':'অনুশীলনী পরীক্ষা','Writing bank':'লেখার সংগ্রহ','My Wordbook':'আমার শব্দভান্ডার','Open section':'অংশটি খুলুন','Back to class':'শ্রেণিতে ফিরুন','Official NCTB 2026 book listing':'এনসিটিবির ২০২৬ সালের সরকারি বইয়ের তালিকা','SSC 2026 assessment notice':'এসএসসি ২০২৬ মূল্যায়ন বিজ্ঞপ্তি','All tasks':'সব ধরনের লেখা','Paragraphs':'অনুচ্ছেদ','Dialogues':'সংলাপ','Letters & emails':'চিঠি ও ইমেইল','Compositions':'রচনা','Story completion':'গল্প সম্পূর্ণ করা','Applications':'আবেদন','Read model answer':'নমুনা উত্তর পড়ুন','Bangla guidance':'বাংলা নির্দেশনা','Prompt':'প্রশ্ন','Check answer':'উত্তর দেখুন','Open model answer':'নমুনা উত্তর খুলুন','Back to Academy':'একাডেমিতে ফিরুন','curriculum topics':'পাঠ্যক্রমের বিষয়','model answers':'নমুনা উত্তর','practice sets':'অনুশীলনী সেট','original model answers':'নিজস্ব নমুনা উত্তর','Sources':'সূত্র','topics':'বিষয়','Open wordbook':'আমার শব্দভান্ডার খুলুন','Writing task':'লেখার কাজ','Reading passage':'পাঠাংশ','Use this as a model; adapt it in your own words.':'এটিকে নমুনা ধরে নিজের ভাষায় লিখো।','No answers in this category.':'এই ধরনে কোনো উত্তর নেই।','Choose another writing filter to browse this class.':'এই শ্রেণির অন্য লেখা দেখতে আরেকটি ফিল্টার বেছে নিন।','Filter writing tasks':'লেখার ধরন ছাঁকুন','NCTB 2026 · general Bangla-medium':'এনসিটিবি ২০২৬ · সাধারণ বাংলা মাধ্যম','Choose a class to browse textbook themes and practice.':'পাঠ্যবইয়ের বিষয় ও অনুশীলন দেখতে শ্রেণি বেছে নিন।','English answers · concise Bangla writing support':'ইংরেজি উত্তর · সংক্ষিপ্ত বাংলা লেখার সহায়তা','Original practice; not an official paper.':'নিজস্ব অনুশীলনী; সরকারি প্রশ্নপত্র নয়।','Textbook-mapped practice':'পাঠ্যবইভিত্তিক অনুশীলন','English-medium is planned for a later release.':'ইংরেজি মাধ্যম পরে যুক্ত করা হবে।','Study the textbook themes and language skills.':'পাঠ্যবইয়ের বিষয় ও ভাষাদক্ষতা পড়ুন।','Original, syllabus-mapped practice sets.':'পাঠ্যক্রমভিত্তিক নিজস্ব অনুশীলনী।','Model answers with short Bangla support.':'সংক্ষিপ্ত বাংলা সহায়তাসহ নমুনা উত্তর।','Saved words, notes, and review stay unchanged.':'সংরক্ষিত শব্দ, নোট ও পুনরাবৃত্তি অপরিবর্তিত থাকবে।', "2026 NCTB textbook list":"এনসিটিবির ২০২৬ সালের পাঠ্যবইয়ের তালিকা", "Prescribed English books":"নির্ধারিত ইংরেজি বই", "Language skills":"ভাষার দক্ষতা", "Writing practice":"লেখার অনুশীলন", "Written forms":"লেখার ধরন", "SSC 2026 writing structure":"SSC 2026 লেখার কাঠামো", "SSC 2026 assessment reference":"SSC 2026 মূল্যায়ন নির্দেশনা", "Paper 1 writing: story completion (15) + dialogue (15). Paper 2: Grammar (60) + Writing (40), with paragraph (10) + email/letter/application (10) + short composition (20). Practice sets are not official papers.":"English 1st Paper-এর Writing: গল্প সম্পূর্ণ করা (১৫) ও সংলাপ লেখা (১৫)। English 2nd Paper: Grammar (60) + Writing (40), যেখানে অনুচ্ছেদ (১০), ইমেইল/চিঠি/আবেদন (১০) ও সংক্ষিপ্ত রচনা (২০)। এগুলো অনুশীলনী, সরকারি প্রশ্নপত্র নয়।", "Classes 6–8 use textbook-mapped practice. School term plans can vary; this page does not claim one national paper pattern.":"৬–৮ শ্রেণির অনুশীলন পাঠ্যবইয়ের বিষয়ভিত্তিক। স্কুলভেদে পরীক্ষার পরিকল্পনা বদলাতে পারে; এখানে একটিমাত্র জাতীয় প্রশ্নপদ্ধতির দাবি করা হয় না।", "Classes 9–10 follow the SSC 2026 English structure: English 1st Paper Writing 30 (story completion 15 + dialogue 15); English 2nd Paper Grammar 60 + Writing 40 (paragraph 10, email/letter/application 10, short composition 20).":"৯–১০ শ্রেণিতে SSC 2026 কাঠামো প্রযোজ্য: English 1st Paper Writing 30 (গল্প ১৫ + সংলাপ ১৫); English 2nd Paper Grammar 60 + Writing 40 (অনুচ্ছেদ ১০, ইমেইল/চিঠি/আবেদন ১০, সংক্ষিপ্ত রচনা ২০)।", "For Classes 6–8, use the selected textbook, school plan, and these practice tasks together. The Academy does not present a single national exam blueprint for these grades.":"৬–৮ শ্রেণির জন্য নির্বাচিত পাঠ্যবই, স্কুলের পরিকল্পনা ও এই অনুশীলনগুলো একসঙ্গে ব্যবহার করুন। Academy এই শ্রেণিগুলোর জন্য একটি জাতীয় পরীক্ষার কাঠামো দাবি করে না।", "SSC 2026 marks are shown for the relevant writing sections. These are original practice sets, not official NCTB or board question papers.":"প্রাসঙ্গিক লেখার অংশে SSC 2026-এর নম্বর দেখানো হয়েছে। এগুলো নিজস্ব অনুশীলনী, এনসিটিবি বা বোর্ডের সরকারি প্রশ্নপত্র নয়।", "These original reading, language, and writing sets are mapped to textbook themes. They do not claim an official national marks distribution or term-paper pattern.":"এই নিজস্ব পঠন, ভাষা ও লেখার অনুশীলন পাঠ্যবইয়ের বিষয়ভিত্তিক। এগুলো কোনো সরকারি জাতীয় নম্বর-বণ্টন বা স্কুল পরীক্ষার নির্দিষ্ট কাঠামোর দাবি করে না।", "Class 6 lessons are grouped by theme for easier revision.":"সহজে পুনরাবৃত্তির জন্য ষষ্ঠ শ্রেণির পাঠগুলো বিষয়ভিত্তিকভাবে সাজানো হয়েছে।", "This study map summarises themes; follow the printed book for full lesson text.":"এই মানচিত্রে বিষয়গুলোর সারাংশ দেওয়া হয়েছে; পূর্ণ পাঠের জন্য মুদ্রিত বই অনুসরণ করুন।"
      }
    };
    deepFreeze(ACADEMY_UI_TRANSLATIONS);
    function academyGradeData(grade = state.academyClass) {
      const gradeNumber = Number(grade);
      return Number.isInteger(gradeNumber) && hasOwn(ACADEMY_CONTENT.grades, gradeNumber) ? ACADEMY_CONTENT.grades[gradeNumber] : null;
    }
    function academyEntriesForGrade(grade = state.academyClass) {
      const gradeNumber = Number(grade);
      return ACADEMY_CONTENT.writing.filter(entry => entry.grade === gradeNumber);
    }
    function academyTypeName(type) {
      const labels = { paragraph: 'Paragraph', dialogue: 'Dialogue', email: 'Email / letter', letter: 'Email / letter', composition: 'Composition', story: 'Story completion', application: 'Application' };
      return uiText(labels[type] || 'Writing task');
    }
    function academySectionHeader(gradeNumber, title, subtitle) {
      return `<header class="academy-subpage-header"><button type="button" class="academy-back-button" data-action="academy-back-class">← ${escapeHtml(uiText('Back to class'))} ${gradeNumber}</button><div class="eyebrow">${escapeHtml(uiText('Academy'))} · ${escapeHtml(uiText('Class'))} ${gradeNumber}</div><h1>${escapeHtml(uiText(title))}</h1><p>${escapeHtml(uiText(subtitle))}</p></header>`;
    }
    function renderAcademyClassPicker() {
      const grades = [6, 7, 8, 9, 10];
      return `<div class="page academy-page"><header class="page-header academy-page-header"><div class="eyebrow">${escapeHtml(uiText('NCTB 2026 · general Bangla-medium'))}</div><h1>${escapeHtml(uiText('Academy'))}</h1><p>${escapeHtml(uiText('Choose a class to browse textbook themes and practice.'))}</p></header><section class="academy-scope-note"><div class="academy-scope-mark" aria-hidden="true">📘</div><div><strong>${escapeHtml(uiText('English answers · concise Bangla writing support'))}</strong><p>${escapeHtml(uiText('English-medium is planned for a later release.'))}</p></div></section><div class="academy-grade-grid" role="group" aria-label="${escapeHtml(uiText('Choose a class'))}">${grades.map(gradeNumber => {
        const grade = academyGradeData(gradeNumber);
        const answers = academyEntriesForGrade(gradeNumber).length;
        return `<button type="button" class="academy-grade-card" data-action="academy-select-class" data-grade="${gradeNumber}"><span class="academy-grade-kicker">${escapeHtml(uiText('Class'))}</span><strong>${gradeNumber}</strong><span class="academy-grade-meta">${grade.units.length} ${escapeHtml(uiText('curriculum topics'))} · ${answers} ${escapeHtml(uiText('model answers'))}</span><span class="academy-grade-arrow" aria-hidden="true">→</span></button>`;
      }).join('')}</div><div class="academy-wordbook-strip"><div><strong>${escapeHtml(uiText('My Wordbook'))}</strong><span>${escapeHtml(uiText('Saved words, notes, and review stay unchanged.'))}</span></div><button type="button" class="academy-wordbook-link" data-view="wordbook">${escapeHtml(uiText('Open wordbook'))} ${iconArrow()}</button></div></div>`;
    }
    function renderAcademyClassHome(gradeNumber, grade) {
      const writingCount = academyEntriesForGrade(gradeNumber).length;
      const ssc = gradeNumber >= 9;
      const sections = [
        { id: 'syllabus', icon: '🗺️', title: 'Curriculum map', text: 'Study the textbook themes and language skills.', count: `${grade.units.length} ${uiText('curriculum topics')}` },
        { id: 'tests', icon: '📝', title: 'Practice tests', text: 'Original, syllabus-mapped practice sets.', count: `${grade.tests.length} ${uiText('practice sets')}` },
        { id: 'writing', icon: '✍️', title: 'Writing bank', text: 'Model answers with short Bangla support.', count: `${writingCount} ${uiText('model answers')}` }
      ];
      const sectionCards = sections.map(section => `<button type="button" class="academy-section-card" data-action="academy-open-section" data-section="${escapeHtml(section.id)}"><span class="academy-section-icon" aria-hidden="true">${escapeHtml(section.icon)}</span><span class="academy-section-copy"><strong>${escapeHtml(uiText(section.title))}</strong><span>${escapeHtml(uiText(section.text))}</span><small>${escapeHtml(section.count)}</small></span><span class="academy-section-arrow" aria-hidden="true">→</span></button>`).join('');
      const assessmentHeading = uiText(ssc ? 'SSC 2026 writing structure' : 'Textbook-mapped practice');
      const assessmentCopy = uiText(ssc
        ? 'Paper 1 writing: story completion (15) + dialogue (15). Paper 2: Grammar (60) + Writing (40), with paragraph (10) + email/letter/application (10) + short composition (20). Practice sets are not official papers.'
        : 'Classes 6–8 use textbook-mapped practice. School term plans can vary; this page does not claim one national paper pattern.');
      const bookLink = `<a class="academy-source-link" href="${escapeHtml(ACADEMY_CONTENT.sources[gradeNumber])}">${escapeHtml(uiText('Official NCTB 2026 book listing'))} ↗</a>`;
      const assessmentLink = ssc ? `<a class="academy-source-link" href="${escapeHtml(ACADEMY_CONTENT.sources.ssc2026)}">${escapeHtml(uiText('SSC 2026 assessment notice'))} ↗</a>` : '';
      return `<div class="page academy-page"><div class="academy-class-top"><div><div class="eyebrow">${escapeHtml(uiText('NCTB 2026 · general Bangla-medium'))}</div><h1>${escapeHtml(uiText('Class'))} ${gradeNumber}</h1><p>${escapeHtml(uiText('English answers · concise Bangla writing support'))}</p></div></div><section class="academy-assessment-note ${ssc ? 'is-ssc' : ''}"><strong>${escapeHtml(assessmentHeading)}</strong><p>${escapeHtml(assessmentCopy)}</p></section><div class="academy-section-grid">${sectionCards}</div><div class="academy-wordbook-strip"><div><strong>${escapeHtml(uiText('My Wordbook'))}</strong><span>${escapeHtml(uiText('Saved words, notes, and review stay unchanged.'))}</span></div><button type="button" class="academy-wordbook-link" data-view="wordbook">${escapeHtml(uiText('Open wordbook'))} ${iconArrow()}</button></div><div class="academy-source-row"><span>${escapeHtml(uiText('Sources'))}: ${escapeHtml(grade.books.join(' · '))}</span>${bookLink}${assessmentLink}</div></div>`;
    }
    function renderAcademySyllabus(gradeNumber, grade) {
      const ssc = gradeNumber >= 9;
      const units = grade.units.map((unit, index) => `<article class="academy-unit-card"><span class="academy-unit-number">${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(unit.title)}</h3><p>${escapeHtml(unit.focus)}</p></div></article>`).join('');
      const grammar = grade.grammar.map(item => `<li>${escapeHtml(item)}</li>`).join('');
      const writing = grade.writingFormats.map(item => `<li>${escapeHtml(item)}</li>`).join('');
      const books = grade.books.map(book => `<span>${escapeHtml(book)}</span>`).join('');
      const assessmentHeading = uiText(ssc ? 'SSC 2026 assessment reference' : 'Practice-format note');
      const assessmentCopy = uiText(ssc
        ? 'Classes 9–10 follow the SSC 2026 English structure: English 1st Paper Writing 30 (story completion 15 + dialogue 15); English 2nd Paper Grammar 60 + Writing 40 (paragraph 10, email/letter/application 10, short composition 20).'
        : 'For Classes 6–8, use the selected textbook, school plan, and these practice tasks together. The Academy does not present a single national exam blueprint for these grades.');
      const assessmentLink = ssc ? `<a class="academy-source-link" href="${escapeHtml(ACADEMY_CONTENT.sources.ssc2026)}">${escapeHtml(uiText('SSC 2026 assessment notice'))} ↗</a>` : '';
      const lessonHeading = uiText(gradeNumber === 6 ? 'Lesson groups and themes' : 'Units and themes');
      const mapDescription = uiText(gradeNumber === 6
        ? 'Class 6 lessons are grouped by theme for easier revision.'
        : 'This study map summarises themes; follow the printed book for full lesson text.');
      return `<div class="page academy-page">${academySectionHeader(gradeNumber, 'Curriculum map', uiText('Study the textbook themes and language skills.'))}<section class="academy-book-card"><div><div class="eyebrow">${escapeHtml(uiText('2026 NCTB textbook list'))}</div><h2>${escapeHtml(uiText('Prescribed English books'))}</h2><div class="academy-book-chips">${books}</div><p>${escapeHtml(mapDescription)}</p></div><a class="academy-source-link" href="${escapeHtml(ACADEMY_CONTENT.sources[gradeNumber])}">${escapeHtml(uiText('Official NCTB 2026 book listing'))} ↗</a></section><section class="academy-content-section"><div class="academy-section-heading"><div><div class="eyebrow">${escapeHtml(uiText('English for Today'))}</div><h2>${escapeHtml(lessonHeading)}</h2></div><span class="academy-count-pill">${grade.units.length} ${escapeHtml(uiText('topics'))}</span></div><div class="academy-unit-list">${units}</div></section><div class="academy-map-columns"><section class="academy-map-card"><div class="eyebrow">${escapeHtml(uiText('English Grammar and Composition'))}</div><h2>${escapeHtml(uiText('Language skills'))}</h2><ul>${grammar}</ul></section><section class="academy-map-card"><div class="eyebrow">${escapeHtml(uiText('Writing practice'))}</div><h2>${escapeHtml(uiText('Written forms'))}</h2><ul>${writing}</ul></section></div><section class="academy-assessment-note ${ssc ? 'is-ssc' : ''}"><strong>${escapeHtml(assessmentHeading)}</strong><p>${escapeHtml(assessmentCopy)}</p>${assessmentLink}</section></div>`;
    }
    function renderAcademyTests(gradeNumber, grade) {
      const ssc = gradeNumber >= 9;
      const testCards = grade.tests.map(test => {
        const passage = test.passage ? `<section class="academy-passage"><h4>${escapeHtml(test.passageTitle || uiText('Reading passage'))}</h4><p>${escapeHtml(test.passage)}</p></section>` : '';
        const sections = (test.sections || []).map(section => `<section class="academy-test-section"><h4>${escapeHtml(section.label)}</h4><ol>${section.items.map(item => `<li><p>${escapeHtml(item.prompt)}</p><details class="academy-answer-key"><summary>${escapeHtml(uiText('Check answer'))}</summary><p>${escapeHtml(item.answer)}</p></details></li>`).join('')}</ol></section>`).join('');
        const writingPrompt = test.writingPrompt ? `<section class="academy-test-writing"><h4>${escapeHtml(uiText('Writing task'))}</h4><p>${escapeHtml(test.writingPrompt)}</p><button type="button" class="academy-answer-link" data-action="academy-view-answer" data-writing-id="${escapeHtml(test.writingId || '')}">${escapeHtml(uiText('Open model answer'))} ${iconArrow()}</button></section>` : '';
        const tasks = (test.tasks || []).map(task => `<li class="academy-test-task"><div><strong>${escapeHtml(task.label)}</strong><p>${escapeHtml(task.prompt)}</p></div><button type="button" class="academy-answer-link" data-action="academy-view-answer" data-writing-id="${escapeHtml(task.writingId || '')}">${escapeHtml(uiText('Open model answer'))} ${iconArrow()}</button></li>`).join('');
        return `<article class="academy-test-card"><div class="academy-test-card-head"><span class="academy-test-badge">${escapeHtml(test.badge || uiText('Original practice; not an official paper.'))}</span><h3>${escapeHtml(test.title)}</h3><p>${escapeHtml(test.note)}</p></div>${passage}${sections}${writingPrompt}${tasks ? `<ol class="academy-test-task-list">${tasks}</ol>` : ''}</article>`;
      }).join('');
      return `<div class="page academy-page">${academySectionHeader(gradeNumber, 'Practice tests', uiText(ssc ? 'Original practice; not an official paper.' : 'Textbook-mapped practice'))}<section class="academy-test-notice"><strong>${escapeHtml(uiText('Original practice; not an official paper.'))}</strong><p>${escapeHtml(uiText(ssc ? 'SSC 2026 marks are shown for the relevant writing sections. These are original practice sets, not official NCTB or board question papers.' : 'These original reading, language, and writing sets are mapped to textbook themes. They do not claim an official national marks distribution or term-paper pattern.'))}</p></section><div class="academy-test-list">${testCards}</div></div>`;
    }
    function renderAcademyWriting(gradeNumber) {
      const filter = state.academyWritingFilter || 'all';
      const filters = [
        ['all', 'All tasks'], ['paragraph', 'Paragraphs'], ['dialogue', 'Dialogues'], ['communication', 'Letters & emails'], ['composition', 'Compositions'], ['story', 'Story completion'], ['application', 'Applications']
      ];
      const entries = academyEntriesForGrade(gradeNumber).filter(entry => filter === 'all' || (filter === 'communication' ? ['email', 'letter'].includes(entry.type) : entry.type === filter));
      const cards = entries.map(entry => `<article class="academy-writing-card"><div class="academy-writing-meta"><span class="academy-type-pill">${escapeHtml(academyTypeName(entry.type))}</span><span>${escapeHtml(entry.unit)}</span></div><h3>${escapeHtml(entry.title)}</h3><p class="academy-writing-prompt"><strong>${escapeHtml(uiText('Prompt'))}:</strong> ${escapeHtml(entry.prompt)}</p><details class="academy-model-answer" ${state.academyOpenAnswerId === entry.id ? 'open' : ''}><summary>${escapeHtml(uiText('Read model answer'))}</summary><div class="academy-answer-body"><p class="academy-answer-text">${escapeHtml(entry.modelAnswer)}</p><div class="academy-bangla-note"><strong>${escapeHtml(uiText('Bangla guidance'))}</strong><p>${escapeHtml(entry.banglaNote)}</p></div><p class="academy-adapt-note">${escapeHtml(uiText('Use this as a model; adapt it in your own words.'))}</p></div></details></article>`).join('');
      return `<div class="page academy-page">${academySectionHeader(gradeNumber, 'Writing bank', uiText('Model answers with short Bangla support.'))}<div class="academy-writing-toolbar" role="group" aria-label="${escapeHtml(uiText('Filter writing tasks'))}">${filters.map(([id, label]) => `<button type="button" class="academy-filter-chip ${filter === id ? 'is-active' : ''}" data-action="academy-writing-filter" data-writing-filter="${id}" aria-pressed="${filter === id}">${escapeHtml(uiText(label))}</button>`).join('')}</div><p class="academy-writing-count">${entries.length} ${escapeHtml(uiText('original model answers'))} · ${escapeHtml(uiText('Original practice; not an official paper.'))}</p>${cards ? `<div class="academy-writing-grid">${cards}</div>` : `<div class="empty-state"><h3>${escapeHtml(uiText('No answers in this category.'))}</h3><p>${escapeHtml(uiText('Choose another writing filter to browse this class.'))}</p></div>`}<div class="academy-wordbook-strip"><div><strong>${escapeHtml(uiText('My Wordbook'))}</strong><span>${escapeHtml(uiText('Saved words, notes, and review stay unchanged.'))}</span></div><button type="button" class="academy-wordbook-link" data-view="wordbook">${escapeHtml(uiText('Open wordbook'))} ${iconArrow()}</button></div></div>`;
    }
    function renderAcademy() {
      // Only Class 8 is open for now. Other grades remain in ACADEMY_CONTENT for a later release.
      const gradeNumber = 8;
      state.academyClass = gradeNumber;
      const grade = academyGradeData(gradeNumber);
      if (state.academySection === 'syllabus') return renderAcademySyllabus(gradeNumber, grade);
      if (state.academySection === 'tests') return renderAcademyTests(gradeNumber, grade);
      if (state.academySection === 'writing') return renderAcademyWriting(gradeNumber);
      return renderAcademyClassHome(gradeNumber, grade);
    }

    function renderWordbook() {
      const isSavedFilter = state.bookFilter === 'saved';
      const ids = isSavedFilter ? state.progress.savedIds : getReviewIds();
      const allQuestions = ids.map(id => QUESTION_BY_ID[id]).filter(Boolean);
      const search = String(state.bookSearch || '').trim().toLowerCase();
      const questions = allQuestions.filter(question => !search || [question.answer, question.definition, question.nuance, question.example, question.family, ...(RELATED_WORDS[question.id] || []), ...(ANTONYMS[question.id] || [])].join(' ').toLowerCase().includes(search));
      const due = new Set(dueReviewIds());
      const title = isSavedFilter ? 'Words you saved.' : 'Words to revisit.';
      const intro = isSavedFilter ? 'Saved words appear here with a definition, a usage note, and an example.' : 'Due and missed words appear first. Saved words are included too, so you can choose an extra review round.';
      const cards = questions.length ? `<div class="word-list">${questions.map(question => renderWordCard(question, state.progress.savedIds.includes(question.id), state.progress.missedIds.includes(question.id), due.has(question.id))).join('')}</div>` : search ? `<div class="empty-state search-empty"><h3>No matching words.</h3><p>Try another spelling, part of a definition, or an example phrase.</p></div>` : `<div class="empty-state"><div class="empty-icon" aria-hidden="true">${isSavedFilter ? '📚' : '🌱'}</div><h3>${isSavedFilter ? 'No saved words yet.' : 'No words are due yet.'}</h3><p>${isSavedFilter ? 'Save a word from any round to find its meaning and example here.' : 'Words you miss will return sooner. Saved words will also appear here for optional review.'}</p><button class="btn btn-primary btn-small" data-action="start-daily-mix">${isSavedFilter ? 'Try a short sampler' : 'Play a mixed sampler'} ${iconArrow()}</button></div>`;
      const backupPanel = `<section class="backup-panel" aria-label="Progress backup"><div class="backup-copy"><strong>Keep your progress portable</strong><p>Your learning data stays in this browser unless you download a backup. Backups do not include unfinished rounds. Restoring replaces current progress and clears any unfinished round.</p></div><div class="backup-actions"><button class="btn btn-outline btn-small" data-action="export-progress">Download backup</button><button class="btn btn-quiet btn-small" data-action="choose-progress-import">Restore backup</button><input id="progress-import" class="sr-only" type="file" accept="application/json,.json" aria-label="Choose a Wordtrail progress backup"></div>${state.pendingImport ? `<div class="backup-preview" role="status"><strong>Backup ready to restore</strong><p>It contains ${state.pendingImport.totalAnswered} answered questions, ${state.pendingImport.savedIds.length} saved word${state.pendingImport.savedIds.length === 1 ? '' : 's'}, and ${Object.keys(state.pendingImport.reviewSchedule).length} scheduled word${Object.keys(state.pendingImport.reviewSchedule).length === 1 ? '' : 's'}. This replaces current progress and clears any unfinished round.</p><div class="backup-preview-actions"><button class="btn btn-primary btn-small" data-action="confirm-progress-import">Replace with this backup</button><button class="btn btn-outline btn-small" data-action="cancel-progress-import">Cancel</button></div></div>` : ''}</section>`;
      return `<div class="page"><header class="page-header"><button type="button" class="academy-back-button" data-view="academy">${escapeHtml(uiText('Back to Academy'))}</button><div class="eyebrow">YOUR WORD COLLECTION</div><h1>${title}</h1><p>${intro}</p></header>${backupPanel}
        <div class="wordbook-toolbar"><button class="filter-chip ${isSavedFilter ? 'active' : ''}" data-action="book-filter" data-filter="saved" aria-pressed="${isSavedFilter}">Saved words · ${state.progress.savedIds.length}</button><button class="filter-chip ${!isSavedFilter ? 'active' : ''}" data-action="book-filter" data-filter="review" aria-pressed="${!isSavedFilter}">Review queue · ${getReviewIds().length}</button>${getReviewIds().length ? `<button class="btn btn-quiet btn-small" data-action="start-review">Review words ${iconArrow()}</button>` : ''}<button class="btn btn-primary btn-small" data-action="start-flashcards">Review as flashcards ${iconArrow()}</button></div>
        <label class="word-search-label" for="word-search">Search by word, meaning, or example</label><div class="word-search-row"><input id="word-search" type="search" maxlength="120" value="${escapeHtml(sanitizeUserText(state.bookSearch || '', 120))}" placeholder="For example: calm, fair, or a phrase" data-i18n-placeholder="For example: calm, fair, or a phrase" autocomplete="off">${search ? '<button class="text-button" data-action="clear-book-search">Clear search</button>' : ''}</div>
        ${cards}</div>`;
    }
    function flashcardQueueIds(now = Date.now()) {
      const candidates = [...new Set([...dueReviewIds(now), ...state.progress.missedIds, ...state.progress.savedIds])];
      return candidates.filter(id => {
        if (!hasOwn(QUESTION_BY_ID, id)) return false;
        const schedule = state.progress.reviewSchedule[id];
        return !schedule || !Number.isFinite(schedule.dueAt) || schedule.dueAt <= now;
      });
    }
    function startFlashcards() {
      const ids = flashcardQueueIds();
      if (!ids.length) showToast('You are caught up. Scheduled words return when they are due.');
      state.session = null; state.miniSession = null; state.toneSession = null;
      state.flashcardSession = { ids: ids.slice(0, 20), index: 0, revealed: false };
      state.view = 'flashcards';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function rateFlashcard(rating) {
      const session = state.flashcardSession;
      const question = session && QUESTION_BY_ID[session.ids[session.index]];
      if (!question || !session.revealed || !['easy', 'medium', 'hard'].includes(rating)) return;
      const now = Date.now();
      const previous = state.progress.reviewSchedule[question.id] || { stage: 0, dueAt: 0, correctCount: 0, lapses: 0, lastReviewedAt: null };
      const plan = rating === 'easy' ? { days: 7, stage: Math.min(REVIEW_INTERVAL_DAYS.length, previous.stage + 2) }
        : rating === 'medium' ? { days: 3, stage: Math.min(REVIEW_INTERVAL_DAYS.length, previous.stage + 1) }
        : { days: 1, stage: Math.max(0, previous.stage - 1) };
      state.progress.reviewSchedule[question.id] = { stage: plan.stage, dueAt: now + plan.days * 86_400_000, correctCount: previous.correctCount + (rating === 'hard' ? 0 : 1), lapses: previous.lapses + (rating === 'hard' ? 1 : 0), lastReviewedAt: now };
      if (!state.progress.masteryLevels) state.progress.masteryLevels = {};
      state.progress.masteryLevels[question.id] = rating.charAt(0).toUpperCase() + rating.slice(1);
      if (rating === 'hard') {
        if (!state.progress.missedIds.includes(question.id)) state.progress.missedIds.push(question.id);
      } else state.progress.missedIds = state.progress.missedIds.filter(id => id !== question.id);
      saveProgress();
      session.index += 1; session.revealed = false;
      if (session.index >= session.ids.length) { markPracticeDay('review'); showToast('Flashcard review saved.'); }
      render();
    }
    function renderFlashcards() {
      const session = state.flashcardSession;
      if (!session) return renderWordbook();
      if (session.index >= session.ids.length) {
        const caughtUp = session.ids.length === 0;
        return `<div class="page flashcard-shell"><div class="eyebrow">${escapeHtml(uiText('Word review'))}</div><section class="flashcard-card"><h1>${escapeHtml(uiText(caughtUp ? 'All caught up.' : 'Round complete.'))}</h1><p>${escapeHtml(uiText(caughtUp ? 'Saved words resurface here when their review date arrives.' : 'Your ratings set when each word returns.'))}</p><button class="btn btn-primary" data-view="wordbook">${escapeHtml(uiText('Back to home'))}</button></section></div>`;
      }
      const question = QUESTION_BY_ID[session.ids[session.index]];
      const progress = Math.round((session.index / session.ids.length) * 100);
      const sentence = escapeHtml(question.sentence).replace('____', '<span class="blank-slot">?</span>');
      return `<div class="page flashcard-shell"><div class="challenge-top"><button class="back-button" data-action="exit-flashcards">← &nbsp;${escapeHtml(uiText('My wordbook'))}</button><div class="step-count">${escapeHtml(uiText('Word review'))} · ${session.index + 1} / ${session.ids.length}</div></div><div class="progress-track challenge-progress" role="progressbar" aria-label="Flashcard progress" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress}%"></span></div><section class="flashcard-card"><div class="eyebrow">${escapeHtml(question.family)} · ${session.index + 1} of ${session.ids.length}</div><h1>${escapeHtml(uiText('Recall the word'))}</h1><p class="flashcard-prompt">${sentence}</p>${session.revealed ? `<div class="flashcard-answer"><h2>${escapeHtml(question.answer)} ${speakerButton(question.answer)}</h2><p>${escapeHtml(question.definition)}</p>${renderGlossLine(question.id)}<p>${escapeHtml(question.example)}</p></div><p class="hint-line">${escapeHtml(uiText('Choose how well you remembered it.'))}</p><div class="rating-row"><button class="rating-button" data-action="rate-flashcard" data-rating="hard">${escapeHtml(uiText('Hard'))}<small>${escapeHtml(uiText('Tomorrow'))}</small></button><button class="rating-button" data-action="rate-flashcard" data-rating="medium">${escapeHtml(uiText('Medium'))}<small>${escapeHtml(uiText('In 3 days'))}</small></button><button class="rating-button" data-action="rate-flashcard" data-rating="easy">${escapeHtml(uiText('Easy'))}<small>${escapeHtml(uiText('In 7 days'))}</small></button></div>` : `<button class="btn btn-primary" data-action="flip-flashcard">${escapeHtml(uiText('Reveal the word'))} ${iconArrow()}</button>`}</section></div>`;
    }
    function renderChallenge() {
      const session = state.session;
      const question = currentQuestion();
      if (!session || !question) return renderSummary();
      const env = getEnvironment(question.env);
      const total = session.questions.length;
      const complete = session.index + (session.showingFeedback ? 1 : 0);
      const percent = Math.round((complete / total) * 100);
      const modeLabel = session.mode === 'starter' ? `${LEVELS[state.progress.level]?.label || 'Starter'} · ${env.name}` : session.mode === 'environment' ? `${env.name} trail` : session.mode === 'review' ? 'Word review' : 'Mixed trail';
      const selected = session.choice;
      const correct = selected === question.answer;
      const letters = ['A', 'B', 'C', 'D'];
      const relatedWords = (RELATED_WORDS[question.id] || []).map(word => `<span class="related-chip">${escapeHtml(word)}</span>`).join('');
      const oppositeWords = (ANTONYMS[question.id] || []).map(word => `<span class="related-chip opposite-chip">${escapeHtml(word)}</span>`).join('');
      let feedback = '';
      if (session.showingFeedback) {
        feedback = `<section class="feedback-card ${correct ? '' : 'incorrect-feedback'}"><div class="feedback-heading" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"><span class="feedback-check" aria-hidden="true">${correct ? '✓' : '↗'}</span>${correct ? 'That fits the moment.' : `A closer fit is “${escapeHtml(question.answer)}.”`}</div><div class="feedback-word"><span>Word: <strong>${escapeHtml(question.answer)}</strong></span>${speakerButton(question.answer)}</div><p>${escapeHtml(question.definition)}</p>${renderGlossLine(question.id)}<p class="feedback-extra"><strong>The nuance:</strong> ${escapeHtml(question.nuance)}</p><div class="related-row"><strong>Near-synonyms:</strong> ${relatedWords}</div><div class="related-row"><strong>Opposites:</strong> ${oppositeWords}</div><div class="feedback-actions"><button class="save-word-button" data-action="toggle-saved" data-id="${question.id}">${state.progress.savedIds.includes(question.id) ? '♥ Saved to wordbook' : '♡ Save this word'}</button><button class="btn btn-primary btn-small" data-action="next-question">${session.index + 1 >= total ? 'See your results' : 'Next scene'} ${iconArrow()}</button></div></section>`;
      }
      const options = question.options.map((option, index) => {
        let status = '';
        if (session.showingFeedback) {
          if (option === question.answer) status = 'correct';
          else if (option === selected) status = 'incorrect';
          else status = 'dimmed';
        }
        return `<div class="option-row"><button class="option-button ${status}" data-action="answer" data-answer="${escapeHtml(option)}" ${session.showingFeedback ? 'disabled' : ''} aria-label="Option ${letters[index]}: ${escapeHtml(option)}"><span class="option-letter">${letters[index]}</span><span class="option-word">${escapeHtml(option)}</span></button>${speakerButton(option)}</div>`;
      }).join('');
      return `<div class="page challenge-page"><div class="challenge-top"><button class="back-button" data-action="exit-challenge">← &nbsp;Leave this trail</button><div class="step-count">${escapeHtml(modeLabel)} &nbsp;·&nbsp; Scene ${session.index + 1} of ${total}</div></div><div class="progress-track challenge-progress" role="progressbar" aria-label="Challenge progress" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent}%"></span></div>
        <div class="challenge-grid"><section class="question-card"><div class="scene-chip"><span class="scene-emoji" aria-hidden="true">${env.icon}</span><span class="scene-name">${escapeHtml(env.name)}</span><span>·</span><span>${escapeHtml(question.scene)}</span><span class="tier-badge ${question.band === 'Stretch' ? 'stretch' : ''}">${escapeHtml(question.band || 'Everyday')}</span></div><div class="question-label">CHOOSE THE WORD THAT FITS BEST</div><h1>What’s the best word for this moment?</h1><p class="question-instruction">Read the scene, notice the clue, and pick the option that says exactly what you mean.</p><div class="sentence-box">${escapeHtml(question.sentence).replace('____', '<span class="blank-slot">your word</span>')}</div><div class="hint-line">A small clue: ${escapeHtml(question.hint)}</div>${renderGlossLine(question.id)}<div class="option-list">${options}</div>${feedback}</section>
          <aside class="challenge-aside"><section class="aside-card"><div class="aside-tip-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0c-.7.5-1.1 1.4-1.1 2.3h-4.8c0-.9-.4-1.8-1.1-2.3Z"/></svg></div><h3>Context is your clue</h3><p>Ask what the sentence tells you about tone, intensity, and situation. Related words can still feel quite different.</p></section><section class="aside-card"><h3>Your trail</h3><div class="aside-progress-number">${session.correct}<span class="aside-denominator"> / ${session.answered}</span></div><div class="aside-progress-label">right so far in this round</div><div class="mini-track"><span style="width:${session.answered ? Math.round((session.correct/session.answered)*100) : 0}%"></span></div><p style="margin-top:10px">No timer. Take a moment and choose with care.</p></section></aside></div></div>`;
    }
    function renderMiniGame() {
      const session = state.miniSession;
      const round = currentMiniRound();
      if (!session || !round) return renderGames();
      const total = session.rounds.length;
      const complete = session.index + (session.choice !== null ? 1 : 0);
      const percent = Math.round((complete / total) * 100);
      const meta = GAME_INFO[round.type] || GAME_INFO.scene;
      const showFeedback = session.choice !== null;
      const correct = session.choice !== null && isMiniAnswerCorrect(round, session.choice);
      const letters = ['A', 'B', 'C', 'D'];
      const word = round.wordId ? QUESTION_BY_ID[round.wordId] : null;
      const near = word ? (RELATED_WORDS[word.id] || []) : [];
      const opposite = word ? (ANTONYMS[word.id] || []) : [];
      const sentence = round.sentence ? escapeHtml(round.sentence).replace('____', `<span class="blank-slot">${round.type === 'recall' ? 'your word' : 'your words'}</span>`) : '';
      const roundContent = round.type === 'usage'
        ? `<div class="story-passage"><div class="eyebrow">${escapeHtml(round.scene)}</div><p>${sentence}</p></div>`
        : round.story
        ? `<div class="story-passage"><div class="eyebrow">${escapeHtml(round.scene || 'SHORT STORY')}</div><p>${escapeHtml(round.story)}</p></div>`
        : round.type === 'listen'
          ? `<div class="listen-controls"><button class="listen-button" data-action="speak-word" data-word="${escapeHtml(round.audioWord)}" aria-label="Play ${escapeHtml(round.audioWord)} in ${escapeHtml(accentLabel())}" ${speechDisabledAttributes()}><span class="listen-icon" aria-hidden="true">${speakerIcon()}</span><span><strong>Play the word</strong><small>${escapeHtml(accentLabel())}</small></span></button><button class="listen-slow-button" data-action="speak-word" data-word="${escapeHtml(round.audioWord)}" data-rate="slow" ${speechDisabledAttributes()}>Play slowly</button></div>`
          : round.type === 'recall'
            ? `<div class="sentence-box">${sentence}</div><form id="recall-form" class="recall-form"><label class="recall-label" for="recall-answer">Type the missing word</label><div class="recall-row"><input id="recall-answer" class="recall-input" type="text" name="answer" value="${showFeedback ? escapeHtml(session.choice) : escapeHtml(session.draftAnswer || '')}" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="80" enterkeyhint="done" required ${showFeedback ? 'disabled' : ''}><button class="btn btn-primary btn-small" type="submit" ${showFeedback ? 'disabled' : ''}>Check answer</button></div><button class="recall-hint-button" type="button" data-action="toggle-recall-hint" aria-expanded="${Boolean(session.hintVisible)}" aria-controls="recall-clue" ${showFeedback ? 'disabled' : ''}>${session.hintVisible ? 'Hide clue' : 'Show a clue'}</button>${session.hintVisible ? `<p id="recall-clue" class="recall-hint" role="status">Clue: ${escapeHtml(round.clue || 'Think about what the sentence says.')}</p>${round.wordId ? renderGlossLine(round.wordId) : ''}` : ''}</form>`
            : `<div class="sentence-box">${sentence}</div>`;
      const options = (round.options || []).map((option, index) => {
        let status = '';
        if (showFeedback) {
          if (option === round.answer) status = 'correct';
          else if (option === session.choice) status = 'incorrect';
          else status = 'dimmed';
        }
        return `<div class="option-row"><button class="option-button ${status}" data-action="mini-answer" data-answer="${escapeHtml(option)}" ${showFeedback ? 'disabled' : ''} aria-label="Option ${letters[index]}: ${escapeHtml(option)}"><span class="option-letter">${letters[index]}</span><span class="option-word">${escapeHtml(option)}</span></button>${round.type === 'listen' || (round.type === 'usage' && round.id.endsWith('-meaning')) ? '' : speakerButton(option)}</div>`;
      }).join('');
      let feedback = '';
      if (showFeedback) {
        feedback = `<section class="feedback-card ${correct ? '' : 'incorrect-feedback'}"><div class="feedback-heading" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"><span class="feedback-check" aria-hidden="true">${correct ? '✓' : '↗'}</span>${correct ? 'Nice fit.' : `The best fit here is “${escapeHtml(round.answer)}.”`}</div>${!['phrase', 'usage'].includes(round.type) ? `<div class="feedback-word"><span>Word: <strong>${escapeHtml(round.answer)}</strong></span>${speakerButton(round.answer)}</div>` : ''}<p>${escapeHtml(round.explanation)}</p>${round.wordId ? renderGlossLine(round.wordId) : ''}${near.length ? `<div class="related-row"><strong>Near-synonyms:</strong> ${near.map(item => `<span class="related-chip">${escapeHtml(item)}</span>`).join('')}</div>` : ''}${opposite.length ? `<div class="related-row"><strong>Opposites:</strong> ${opposite.map(item => `<span class="related-chip opposite-chip">${escapeHtml(item)}</span>`).join('')}</div>` : ''}<div class="feedback-actions">${word ? `<button class="save-word-button" data-action="toggle-saved" data-id="${word.id}">${state.progress.savedIds.includes(word.id) ? '♥ Saved to wordbook' : '♡ Save this word'}</button>` : '<span class="hint-line" style="margin:0">Small phrase, big difference.</span>'}<button class="btn btn-primary btn-small" data-action="next-mini">${session.index + 1 >= total ? 'See your results' : 'Next turn'} ${iconArrow()}</button></div></section>`;
      }
      const modeTitle = session.mode === 'daily' ? 'Daily sampler' : session.mode === 'review' ? 'Quick review' : meta.name;
      const asideHeading = round.type === 'usage' ? 'Notice the intended action' : round.type === 'listen' ? 'Listen more than once' : round.type === 'story' ? 'Use the story details' : round.type === 'recall' ? 'Start with memory' : 'Notice the context';
      const asideDescription = round.type === 'usage' ? 'Several expressions may be natural English; choose the one supported by this situation. A different action needs a different expression.' : round.type === 'listen'
        ? 'Play the word at normal or slower speed, then match its sound to the spelling. The browser’s speech engine supplies the voice; availability varies by browser and device.'
        : round.type === 'story'
          ? 'Look for the detail that explains the person’s choice. The answer should fit the action, not just the general topic.'
          : round.type === 'recall'
            ? 'Try to retrieve the word before revealing a clue. Answers are case-insensitive, and a miss simply brings the word back for review.'
            : round.type === 'antonym'
              ? 'A word can have different opposites in different senses. Choose the one that fits this sentence.'
              : round.type === 'synonym'
                ? 'Near-synonyms share a meaning, but tone, strength, or formality may shift.'
                : round.type === 'phrase'
                  ? 'Everyday English often pairs certain words together. Choose the phrase that sounds natural in this context.'
                  : 'Use the scene and clue together. The answer should fit the meaning and the situation.';
      return `<div class="page mini-page"><div class="challenge-top"><button class="back-button" data-action="exit-mini">← &nbsp;All practice types</button><div class="step-count">${escapeHtml(modeTitle)} &nbsp;·&nbsp; Turn ${session.index + 1} of ${total}</div></div><div class="progress-track challenge-progress" role="progressbar" aria-label="Mini-game progress" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent}%"></span></div><div class="mini-game-layout"><section class="question-card mini-question-card"><div class="mini-mode-pill" style="--game-tint:${meta.color}"><span aria-hidden="true">${meta.icon}</span>${escapeHtml(meta.name)}<span class="mini-band">${word ? escapeHtml(word.band || 'Everyday') : round.type === 'listen' ? 'LISTENING' : round.type === 'recall' ? 'RECALL' : round.type === 'usage' ? 'INTERMEDIATE' : 'EVERYDAY PHRASE'}</span></div><div class="question-label">${escapeHtml(meta.label)}</div><h1>${escapeHtml(round.prompt)}</h1>${roundContent}${round.clue && !['listen', 'recall'].includes(round.type) ? `<div class="hint-line">A clue: ${escapeHtml(round.clue)}</div>${!showFeedback && round.wordId ? renderGlossLine(round.wordId) : ''}` : ''}${round.type === 'recall' ? '' : `<div class="option-list">${options}</div>`}${feedback}</section><aside class="challenge-aside"><section class="aside-card"><div class="aside-tip-icon" aria-hidden="true">✦</div><h3>${asideHeading}</h3><p>${asideDescription}</p></section><section class="aside-card"><h3>This short round</h3><div class="aside-progress-number">${session.correct}<span class="aside-denominator"> / ${session.answered}</span></div><div class="aside-progress-label">best fits so far</div><div class="mini-track"><span style="width:${session.answered ? Math.round((session.correct/session.answered)*100) : 0}%"></span></div><p style="margin-top:10px">No timer. Stop whenever you need.</p></section></aside></div></div>`;
    }
    function renderMiniSummary() {
      const session = state.miniSession;
      if (!session) return renderGames();
      const total = session.rounds.length || 1;
      const percent = Math.round((session.correct / total) * 100);
      const misses = session.rounds.filter(round => session.missedIds.includes(round.id));
      const title = percent === 100 ? 'Every answer fits.' : percent >= 60 ? 'Round complete.' : 'Round complete. Review the examples below.';
      return `<div class="page"><div class="challenge-top"><button class="back-button" data-view="games">← &nbsp;Choose another game</button><div class="step-count">ROUND COMPLETE</div></div><section class="summary-card"><div><div class="eyebrow">${session.mode === 'daily' ? 'FOUR-PART SAMPLER' : session.mode === 'review' ? 'QUICK REVIEW' : escapeHtml(GAME_INFO[session.mode]?.name || 'MINI-GAME').toUpperCase()}</div><h1>${title}</h1><p>You found a good fit on ${session.correct} of ${session.rounds.length} turns. Your progress is saved; you can come back whenever it suits you.</p></div><div class="score-ring" style="--score:${percent}" role="img" aria-label="Score ${percent} percent"><div><div class="score-number">${percent}%</div><div class="score-caption">best fit</div></div></div></section><div class="summary-actions"><button class="btn btn-primary" data-action="play-mini-again">Play another round ${iconArrow()}</button>${misses.length ? '<button class="btn btn-quiet" data-action="retry-mini">Replay the tricky turns</button>' : ''}<button class="btn btn-outline" data-view="home">Back home</button></div><div class="section-heading"><div><h2>What you practiced</h2><p>Each result includes a useful distinction—not just a right or wrong mark.</p></div></div><div class="review-results">${session.rounds.map(round => { const missed = session.missedIds.includes(round.id); const prompt = round.prompt; return `<div class="result-row"><div class="result-row-main"><strong>${escapeHtml(round.answer)}</strong><p>${escapeHtml(round.explanation)}</p></div><span class="result-status ${missed ? 'retry' : 'good'}">${missed ? 'Worth another look' : '✓ Good fit'}</span></div>`; }).join('')}</div></div>`;
    }
    function renderSummary() {
      const session = state.session;
      if (!session) { state.view = 'home'; return renderHome(); }
      const total = session.questions.length || 1;
      const percent = Math.round((session.correct / total) * 100);
      const missed = session.questions.filter(question => session.missedIds.includes(question.id));
      const title = percent === 100 ? `All ${session.questions.length} choices fit.` : percent >= 60 ? 'Round complete.' : 'Round complete. Review the words below.';
      const subtitle = percent === 100 ? 'You matched each word to its context.' : `${session.correct} of ${session.questions.length} answers fit best. Review the examples and try a missed word again when you want.`;
      return `<div class="page"><div class="challenge-top"><button class="back-button" data-view="home">← &nbsp;Back to home</button><div class="step-count">TRAIL COMPLETE</div></div><section class="summary-card"><div><div class="eyebrow">${session.mode === 'starter' ? `${escapeHtml((LEVELS[state.progress.level]?.label || 'Starter').toUpperCase())} STARTER` : session.mode === 'environment' ? escapeHtml(getEnvironment(session.envId).name.toUpperCase()) : session.mode === 'review' ? 'WORD REVIEW' : 'MIXED TRAIL'} · COMPLETE</div><h1>${title}</h1><p>${subtitle}</p></div><div class="score-ring" style="--score:${percent}" role="img" aria-label="Score ${percent} percent"><div><div class="score-number">${percent}%</div><div class="score-caption">best fit</div></div></div></section>
        <div class="summary-actions"><button class="btn btn-primary" data-action="start-daily-mix">Choose another practice type ${iconArrow()}</button>${missed.length ? `<button class="btn btn-quiet" data-action="review-missed">Practice ${missed.length} missed word${missed.length === 1 ? '' : 's'}</button>` : ''}<button class="btn btn-outline" data-view="wordbook">Open wordbook</button></div>
        <div class="section-heading"><div><h2>Your scenes</h2><p>Each answer is a chance to notice a useful difference.</p></div></div><div class="review-results">${session.questions.map(question => { const wasMissed = session.missedIds.includes(question.id); return `<div class="result-row"><div class="result-row-main"><strong>${escapeHtml(question.answer)}</strong><p>${escapeHtml(question.definition)}</p></div><span class="result-status ${wasMissed ? 'retry' : 'good'}">${wasMissed ? 'Review this one' : '✓ Good fit'}</span></div>`; }).join('')}</div></div>`;
    }
    function renderTone() {
      if (!state.toneSession) state.toneSession = { index: 0, choice: null, correct: 0, optionsByScenario: TONE_SCENARIOS.map(scenario => shuffled(scenario.options)), finished: false };
      const session = state.toneSession;
      if (session.finished) {
        const percent = Math.round((session.correct / TONE_SCENARIOS.length) * 100);
        return `<div class="page"><header class="page-header"><div class="eyebrow">TONE SHIFT · COMPLETE</div><h1>${percent === 100 ? 'All three messages fit their goals.' : 'Tone Shift complete.'}</h1><p>You chose the best tone for ${session.correct} of ${TONE_SCENARIOS.length} situations. Tone depends on who you are speaking to and what you want to communicate.</p></header><div class="summary-actions"><button class="btn btn-primary" data-action="start-tone">Try Tone Shift again ${iconArrow()}</button><button class="btn btn-outline" data-view="home">Back home</button><button class="btn btn-quiet" data-view="nuance">Explore word nuance</button></div></div>`;
      }
      const scenario = TONE_SCENARIOS[session.index];
      const options = session.optionsByScenario?.[session.index] || scenario.options;
      const percent = Math.round((session.index / TONE_SCENARIOS.length) * 100);
      return `<div class="page"><div class="challenge-top"><button class="back-button" data-view="home">← &nbsp;Back to home</button><div class="step-count">TONE SHIFT &nbsp;·&nbsp; ${session.index + 1} OF ${TONE_SCENARIOS.length}</div></div><div class="progress-track challenge-progress" role="progressbar" aria-label="Tone Shift progress" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent}%"></span></div><section class="tone-page-card"><div class="eyebrow">A MESSAGE IS MORE THAN ITS MEANING</div><div class="tone-context"><span class="context-emoji" aria-hidden="true">${scenario.emoji}</span><p>${escapeHtml(scenario.context)}</p></div><div class="tone-goal">GOAL: ${escapeHtml(scenario.goal)}</div><h1 class="tone-instruction">${escapeHtml(scenario.instruction)}</h1><div class="tone-options">${options.map((option, index) => { let style = ''; if (session.choice !== null) style = option.correct ? 'correct' : index === session.choice ? 'incorrect' : ''; return `<button class="tone-option ${style}" data-action="tone-answer" data-index="${index}" ${session.choice !== null ? 'disabled' : ''}>${escapeHtml(option.text)}</button>`; }).join('')}</div>${session.choice !== null ? (() => { const choice = options[session.choice]; return `<section class="feedback-card ${choice.correct ? '' : 'incorrect-feedback'}"><div class="feedback-heading" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"><span class="feedback-check">${choice.correct ? '✓' : '↗'}</span>${choice.correct ? 'A thoughtful fit.' : 'Try noticing the goal.'}</div><p>${escapeHtml(choice.explanation)}</p><div class="feedback-actions"><span class="hint-line" style="margin:0">The most suitable choice for this situation.</span><button class="btn btn-primary btn-small" data-action="next-tone">${session.index + 1 === TONE_SCENARIOS.length ? 'See finish' : 'Next situation'} ${iconArrow()}</button></div></section>`; })() : ''}</section></div>`;
    }
    function focusElementSafely(element) {
      if (!element || typeof element.focus !== 'function') return;
      try { element.focus({ preventScroll: true }); } catch (error) { try { element.focus(); } catch (ignored) { /* Focus is a progressive enhancement. */ } }
    }
    function focusMainHeading() {
      const heading = main && typeof main.querySelector === 'function' ? main.querySelector('h1') : null;
      const target = heading || main;
      if (heading && !heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      focusElementSafely(target);
    }
    function restoreFocusAfterRender(info) {
      if (!info || !info.wasInsideMain || !main || typeof main.querySelectorAll !== 'function') return;
      let target = null;
      if (info.id) target = Array.from(main.querySelectorAll('[id]')).find(element => element.id === info.id && !element.disabled) || null;
      if (!target && info.action) {
        const keys = ['id', 'filter', 'view', 'answer', 'rating', 'game', 'env', 'level', 'index'];
        target = Array.from(main.querySelectorAll('[data-action]')).find(element => {
          if (element.disabled || !element.dataset || element.dataset.action !== info.action) return false;
          return keys.every(key => info.data[key] === undefined || element.dataset[key] === info.data[key]);
        }) || null;
      }
      if (!target && state.view === 'challenge' && state.session && state.session.showingFeedback) target = main.querySelector('.feedback-heading');
      if (!target && state.view === 'mini' && state.miniSession && state.miniSession.choice !== null) target = main.querySelector('.feedback-heading');
      if (!target && state.view === 'tone' && state.toneSession && state.toneSession.choice !== null) target = main.querySelector('.feedback-heading');
      if (!target && state.view === 'flashcards' && state.flashcardSession && state.flashcardSession.revealed && info.action === 'flip-flashcard') target = main.querySelector('.flashcard-answer h2') || main.querySelector('[data-action="rate-flashcard"]');
      if (!target) target = main.querySelector('h1') || main;
      if (target !== main && target.setAttribute && !target.hasAttribute('tabindex') && !target.matches('button, input, textarea, select, a')) target.setAttribute('tabindex', '-1');
      focusElementSafely(target);
    }
    function render() {
      const activeBefore = document.activeElement;
      const focusInfo = {
        wasInsideMain: Boolean(activeBefore && typeof main.contains === 'function' && main.contains(activeBefore)),
        id: activeBefore && activeBefore.id || '',
        action: activeBefore && activeBefore.dataset && activeBefore.dataset.action || '',
        data: activeBefore && activeBefore.dataset ? { ...activeBefore.dataset } : {}
      };
      const renderers = Object.assign(Object.create(null), { onboarding: renderOnboarding, home: renderHome, academy: renderAcademy, games: renderGames, explore: renderExplore, nuance: renderNuance, wordbook: renderWordbook, flashcards: renderFlashcards, challenge: renderChallenge, summary: renderSummary, mini: renderMiniGame, 'mini-summary': renderMiniSummary, tone: renderTone });
      const safeFragment = sanitizeHtmlFragment(translateMarkup((hasOwn(renderers, state.view) ? renderers[state.view] : renderHome)()));
      localizeSafeAttributes(safeFragment);
      main.replaceChildren(safeFragment);
      const onboardingGlossToggle = document.getElementById('onboarding-gloss-toggle');
      if (onboardingGlossToggle) onboardingGlossToggle.checked = Boolean(state.onboardingShowGloss);
      restoreFocusAfterRender(focusInfo);
      persistActiveSession();
      if (document.body && document.body.classList) { document.body.classList.toggle('onboarding-mode', state.view === 'onboarding'); document.body.classList.toggle('dark-theme', state.progress.theme === 'dark'); }
      updateSettingsControls();
      const accentSelect = document.getElementById('accent-select');
      if (accentSelect) accentSelect.value = state.progress.accent || 'en-US';
      const levelLabel = document.getElementById('level-switch-label');
      if (levelLabel) levelLabel.textContent = state.progress.level ? `${uiText('Level:')} ${uiText(LEVELS[state.progress.level]?.label || 'Beginner')}` : uiText('Choose level');
      document.querySelectorAll('.nav-button[data-view]').forEach(button => {
        const activeView = ['challenge', 'summary'].includes(state.view) ? (state.session?.mode === 'starter' ? 'home' : 'explore') : ['mini', 'mini-summary', 'tone'].includes(state.view) ? 'games' : state.view === 'flashcards' ? 'wordbook' : state.view;
        const buttonActiveView = button.dataset.navContext === 'mobile' && activeView === 'wordbook' ? 'academy' : activeView;
        const isActive = button.dataset.view === buttonActiveView;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-current', isActive ? 'page' : 'false');
      });
      const sidebarStreak = document.getElementById('sidebar-streak');
      if (sidebarStreak) sidebarStreak.textContent = String(currentPracticeStreak());
    }
    function startTone() {
      state.session = null;
      state.miniSession = null;
      state.toneSession = { index: 0, choice: null, correct: 0, optionsByScenario: TONE_SCENARIOS.map(scenario => shuffled(scenario.options)), finished: false };
      state.view = 'tone';
      render();
    }
    function answerTone(index) {
      const session = state.toneSession;
      if (!session || session.choice !== null || session.finished) return;
      const options = session.optionsByScenario?.[session.index] || TONE_SCENARIOS[session.index].options;
      if (!Number.isInteger(index) || index < 0 || index >= options.length) return;
      session.choice = index;
      playAnswerChime(options[index].correct);
      if (options[index].correct) session.correct += 1;
      render();
    }
    function nextTone() {
      const session = state.toneSession;
      if (!session || session.choice === null) return;
      if (session.index + 1 >= TONE_SCENARIOS.length) { session.finished = true; markPracticeDay('tone'); }
      else { session.index += 1; session.choice = null; }
      render();
    }
    function navigate(view) {
      if (!['home','academy','games','explore','nuance','wordbook'].includes(view)) return;
      if (!state.progress.level) { state.view = 'onboarding'; render(); focusMainHeading(); return; }
      state.view = view;
      render();
      focusMainHeading();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.addEventListener('click', event => {
      const navButton = event.target.closest('[data-view]');
      if (navButton) { navigate(navButton.dataset.view); return; }
      const button = event.target.closest('[data-action]');
      if (!button || button.disabled) return;
      const action = button.dataset.action;
      if (action === 'academy-back-class') { state.academySection = 'overview'; state.academyOpenAnswerId = null; render(); focusMainHeading(); }
      else if (action === 'academy-open-section') {
        const section = button.dataset.section;
        if (['syllabus', 'tests', 'writing'].includes(section)) { state.academySection = section; if (section === 'writing') { state.academyWritingFilter = 'all'; state.academyOpenAnswerId = null; } render(); focusMainHeading(); }
      }
      else if (action === 'academy-writing-filter') {
        const filter = button.dataset.writingFilter;
        if (['all', 'paragraph', 'dialogue', 'communication', 'composition', 'story', 'application'].includes(filter)) { state.academyWritingFilter = filter; state.academyOpenAnswerId = null; render(); }
      }
      else if (action === 'academy-view-answer') {
        const writingId = button.dataset.writingId;
        const entry = ACADEMY_CONTENT.writing.find(item => item.id === writingId && item.grade === Number(state.academyClass));
        if (entry) { state.academySection = 'writing'; state.academyWritingFilter = 'all'; state.academyOpenAnswerId = entry.id; render(); focusMainHeading(); }
      }
      else if (action === 'select-onboarding-language') selectOnboardingLanguage(button.dataset.language);
      else if (action === 'continue-onboarding-language') continueToOnboardingLevel();
      else if (action === 'select-onboarding-level') { if (Object.prototype.hasOwnProperty.call(LEVELS, button.dataset.level)) { state.onboardingLevel = button.dataset.level; render(); } }
      else if (action === 'edit-onboarding-language') { state.onboardingStep = 'language'; render(); focusMainHeading(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else if (action === 'complete-onboarding') finishOnboarding();
      else if (action === 'change-level') { state.onboardingStep = 'level'; state.onboardingLevel = state.progress.level || null; state.onboardingLanguage = state.progress.uiLanguage || 'en'; state.onboardingShowGloss = Boolean(state.progress.showGloss); state.view = 'onboarding'; render(); focusMainHeading(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else if (action === 'start-recommended') startRecommendedLesson();
      else if (action === 'speak-word') speakWord(button.dataset.word, button.dataset.rate === 'slow');
      else if (action === 'speak-gloss') speakWord(button.dataset.word, false, button.dataset.language);
      else if (action === 'start-daily') startSession('daily');
      else if (action === 'start-daily-mix') startMiniGame('daily');
      else if (action === 'start-scene') startSession('daily');
      else if (action === 'start-mini') startMiniGame(button.dataset.game);
      else if (action === 'start-env') startSession('environment', button.dataset.env);
      else if (action === 'resume-session') {
        if (state.miniSession && !state.miniSession.finished) state.view = 'mini';
        else if (state.session && !state.session.finished) state.view = 'challenge';
        else if (state.toneSession && !state.toneSession.finished) state.view = 'tone';
        else { startMiniGame('daily'); return; }
        render();
      }
      else if (action === 'start-review') startRecallReview(getReviewIds());
      else if (action === 'review-missed') startRecallReview(state.session ? state.session.missedIds : state.progress.missedIds);
      else if (action === 'start-review-one') startRecallReview([button.dataset.id]);
      else if (action === 'start-flashcards') startFlashcards();
      else if (action === 'flip-flashcard') { if (state.flashcardSession) { state.flashcardSession.revealed = true; render(); } }
      else if (action === 'rate-flashcard') rateFlashcard(button.dataset.rating);
      else if (action === 'exit-flashcards') navigate('wordbook');
      else if (action === 'toggle-theme') { state.progress.theme = state.progress.theme === 'dark' ? 'light' : 'dark'; saveProgress(); render(); }
      else if (action === 'toggle-sound') { state.progress.soundEnabled = !state.progress.soundEnabled; saveProgress(); render(); }
      else if (action === 'exit-challenge') navigate('explore');
      else if (action === 'exit-mini') navigate('games');
      else if (action === 'next-question') advanceSession();
      else if (action === 'answer') submitAnswer(button.dataset.answer);
      else if (action === 'mini-answer') submitMiniAnswer(button.dataset.answer);
      else if (action === 'toggle-recall-hint') { if (state.miniSession && state.miniSession.choice === null) { state.miniSession.hintVisible = !state.miniSession.hintVisible; render(); } }
      else if (action === 'next-mini') advanceMiniGame();
      else if (action === 'retry-mini') { const session = state.miniSession; if (session) startMiniGame('review', session.rounds.filter(round => session.missedIds.includes(round.id))); }
      else if (action === 'play-mini-again') { const mode = state.miniSession && state.miniSession.mode; startMiniGame(mode && !['review'].includes(mode) ? mode : 'daily'); }
      else if (action === 'toggle-saved') { toggleSaved(button.dataset.id); render(); }
      else if (action === 'book-filter') { state.bookFilter = button.dataset.filter === 'review' ? 'review' : 'saved'; render(); }
      else if (action === 'clear-book-search') { state.bookSearch = ''; render(); }
      else if (action === 'export-progress') exportProgress();
      else if (action === 'choose-progress-import') { const input = document.getElementById('progress-import'); if (input) input.click(); }
      else if (action === 'confirm-progress-import') confirmProgressImport();
      else if (action === 'cancel-progress-import') { state.pendingImport = null; render(); }
      else if (action === 'nuance-family') { if (hasOwn(NUANCE_SETS, button.dataset.family)) { state.nuanceFamily = button.dataset.family; state.selectedNuanceWord = null; render(); } }
      else if (action === 'select-nuance-word') { const family = NUANCE_SETS[state.nuanceFamily]; if (family && family.words.some(item => item.word === button.dataset.word)) { state.selectedNuanceWord = button.dataset.word; render(); } }
      else if (action === 'start-tone') startTone();
      else if (action === 'tone-answer') answerTone(Number(button.dataset.index));
      else if (action === 'next-tone') nextTone();
    });
    document.addEventListener('input', event => {
      if (!event.target) return;
      if (event.target.id === 'recall-answer' && state.view === 'mini' && state.miniSession && state.miniSession.choice === null) {
        const draft = sanitizeUserText(event.target.value || '', 80);
        event.target.value = draft;
        state.miniSession.draftAnswer = draft;
        persistActiveSession();
        return;
      }
      if (event.target.id !== 'word-search') return;
      const value = sanitizeUserText(event.target.value || '', 120);
      event.target.value = value;
      const cursor = Number.isInteger(event.target.selectionStart) ? event.target.selectionStart : value.length;
      state.bookSearch = value;
      render();
      const searchInput = document.getElementById('word-search');
      if (searchInput) {
        searchInput.focus();
        if (typeof searchInput.setSelectionRange === 'function') searchInput.setSelectionRange(cursor, cursor);
      }
    });
    document.addEventListener('submit', event => {
      if (!event.target) return;
      if (event.target.classList && event.target.classList.contains('word-note-form')) {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const field = event.target.querySelector('textarea');
        if (!hasOwn(QUESTION_BY_ID, id) || !field) return;
        const note = sanitizeUserText(field.value || '', 500).trim();
        field.value = note;
        if (!state.progress.wordNotes) state.progress.wordNotes = {};
        if (note) {
          state.progress.wordNotes[id] = note;
          if (!state.progress.savedIds.includes(id)) state.progress.savedIds.push(id);
          if (!state.progress.masteryLevels[id]) state.progress.masteryLevels[id] = 'Medium';
        } else delete state.progress.wordNotes[id];
        saveProgress();
        render();
        showToast(note ? 'Personal note saved to your wordbook.' : 'Personal note cleared.');
        return;
      }
      if (event.target.id !== 'recall-form') return;
      event.preventDefault();
      const input = document.getElementById('recall-answer');
      const answer = input ? String(input.value || '').trim() : '';
      if (answer) submitMiniAnswer(answer);
    });
    document.addEventListener('change', event => {
      if (!event.target) return;
      if (event.target.id === 'progress-import') {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (file) readProgressImport(file);
        return;
      }
      if (event.target.id === 'ui-language-select') {
        state.progress.uiLanguage = ['en', 'es', 'hi', 'bn', 'fr'].includes(event.target.value) ? event.target.value : 'en';
        saveProgress(); render(); return;
      }
      if (event.target.id === 'gloss-language-select') {
        state.progress.glossLanguage = ['en', 'es', 'hi', 'bn', 'fr'].includes(event.target.value) ? event.target.value : 'es';
        if (state.progress.glossLanguage === 'en') state.progress.showGloss = false;
        saveProgress(); render(); return;
      }
      if (event.target.id === 'gloss-toggle') {
        state.progress.showGloss = Boolean(event.target.checked); saveProgress(); render(); return;
      }
      if (event.target.id === 'onboarding-gloss-toggle') {
        state.onboardingShowGloss = Boolean(event.target.checked);
        state.progress.showGloss = state.onboardingShowGloss;
        saveProgress(); render(); return;
      }
      if (event.target.id !== 'accent-select') return;
      const accent = ACCENT_OPTIONS.some(option => option.value === event.target.value) ? event.target.value : 'en-US';
      state.progress.accent = accent;
      saveProgress();
      showToast(`Pronunciation accent saved: ${accentLabel(accent)}.`);
    });
    document.addEventListener('keydown', event => {
      if (state.view === 'challenge' && state.session) {
        const interactive = event.target.closest('button, input, textarea, select, a');
        if (!interactive && !state.session.showingFeedback && /^[1-4]$/.test(event.key)) {
          const question = currentQuestion();
          const option = question && question.options[Number(event.key) - 1];
          if (option) { event.preventDefault(); submitAnswer(option); }
        } else if (!interactive && state.session.showingFeedback && event.key === 'Enter') {
          event.preventDefault(); advanceSession();
        }
      }
      if (state.view === 'mini' && state.miniSession) {
        const interactive = event.target.closest('button, input, textarea, select, a');
        if (!interactive && state.miniSession.choice === null && /^[1-4]$/.test(event.key)) {
          const round = currentMiniRound();
          const option = round && Array.isArray(round.options) ? round.options[Number(event.key) - 1] : null;
          if (option) { event.preventDefault(); submitMiniAnswer(option); }
        } else if (!interactive && state.miniSession.choice !== null && event.key === 'Enter') {
          event.preventDefault(); advanceMiniGame();
        }
      }
    });

    // Dynamic imports keep the game usable in guest mode if the Supabase CDN is unreachable.
    async function loadCloudModules() {
      if (!cloudModulesPromise) {
        cloudModulesPromise = Promise.all([import('./auth.js'), import('./api.js')]).then(([auth, api]) => {
          cloudAuth = auth;
          cloudApi = api;
          updateAuthChrome();
          return { auth, api };
        });
      }
      return cloudModulesPromise;
    }
    function accountDisplayName(user) {
      const metadataName = user && user.user_metadata && user.user_metadata.username;
      const emailName = user && typeof user.email === 'string' ? user.email.split('@')[0] : '';
      return sanitizeUserText(metadataName || emailName || 'Account', 40).trim() || 'Account';
    }
    function guestSyncMarkerKey(userId) { return `wordtrail-guest-sync-v1:${userId}`; }
    function guestSyncAlreadyDone(userId) {
      try { return localStorage.getItem(guestSyncMarkerKey(userId)) === '1'; } catch (error) { return false; }
    }
    function markGuestSyncDone(userId) {
      try { localStorage.setItem(guestSyncMarkerKey(userId), '1'); } catch (error) { /* The optional sync can be repeated if storage is unavailable. */ }
    }
    function readGuestProgress() { return readProgressFromStorage(STORAGE_KEY) || sanitizeProgress(DEFAULT_PROGRESS); }
    function hasGuestProgress(progress = readGuestProgress()) {
      return Boolean(progress.totalAnswered || progress.savedIds.length || progress.streak || progress.level || progress.uiLanguage !== 'en' || progress.glossLanguage !== 'es' || progress.showGloss || Object.keys(progress.wordNotes || {}).length);
    }
    function updateAuthChrome() {
      const button = document.getElementById('auth-button');
      const note = document.getElementById('auth-config-note');
      const signOutButton = document.getElementById('auth-signout');
      const syncButton = document.getElementById('auth-sync-now');
      if (button) {
        const name = currentUser ? accountDisplayName(currentUser) : 'Guest';
        button.textContent = currentUser ? name.charAt(0).toUpperCase() : 'G';
        button.title = currentUser ? `Account: ${name}` : 'Account: guest mode';
        button.setAttribute('aria-label', currentUser ? `Account: signed in as ${name}` : 'Account: guest mode');
      }
      if (signOutButton) signOutButton.hidden = !currentUser;
      if (syncButton) syncButton.hidden = !currentUser || guestSyncAlreadyDone(currentUser.id) || !hasGuestProgress();
      if (note) {
        if (!cloudAuth || !cloudAuth.isSupabaseConfigured) note.textContent = 'Cloud is optional. Add your Supabase project URL and public anon key in js/config.js to enable accounts.';
        else if (!cloudAuth.isSupabaseReady) note.textContent = 'The Supabase CDN could not be reached. Guest mode still works; check your connection and configuration.';
        else note.textContent = 'Cloud sync is ready. Guest progress remains on this device unless you choose to sync it.';
      }
    }
    function setAuthMessage(message, isError = false) {
      const node = document.getElementById('auth-message');
      if (!node) return;
      node.textContent = sanitizeUserText(message, 280);
      node.style.color = isError ? '#9b4935' : '';
    }
    function openAuthDialog() {
      const dialog = document.getElementById('auth-dialog');
      if (!dialog) return;
      updateAuthChrome();
      setAuthMessage(currentUser ? `Signed in as ${accountDisplayName(currentUser)}.` : 'Guest mode is active on this device.');
      if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    function closeAuthDialog() {
      const dialog = document.getElementById('auth-dialog');
      if (!dialog) return;
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
    }
    function mergeProgressData(left, right, sumActivity = false) {
      const a = sanitizeProgress(left || DEFAULT_PROGRESS);
      const b = sanitizeProgress(right || DEFAULT_PROGRESS);
      const mergeCounter = (one, two) => sumActivity ? one + two : Math.max(one, two);
      const schedule = { ...a.reviewSchedule };
      for (const [id, entry] of Object.entries(b.reviewSchedule)) {
        if (!schedule[id] || (entry.lastReviewedAt || 0) >= (schedule[id].lastReviewedAt || 0)) schedule[id] = entry;
      }
      const dates = [...new Set([...a.practiceDates, ...b.practiceDates])].sort().slice(-60);
      const laterPlayed = a.lastPlayed && b.lastPlayed ? (a.lastPlayed > b.lastPlayed ? a.lastPlayed : b.lastPlayed) : a.lastPlayed || b.lastPlayed;
      const runs = Object.fromEntries([...new Set([...Object.keys(a.gameRuns), ...Object.keys(b.gameRuns)])].map(id => [id, mergeCounter(a.gameRuns[id] || 0, b.gameRuns[id] || 0)]));
      const stats = Object.fromEntries([...new Set([...Object.keys(a.gameStats), ...Object.keys(b.gameStats)])].map(id => {
        const first = a.gameStats[id] || { answered: 0, correct: 0 };
        const second = b.gameStats[id] || { answered: 0, correct: 0 };
        return [id, { answered: mergeCounter(first.answered, second.answered), correct: mergeCounter(first.correct, second.correct) }];
      }));
      return sanitizeProgress({
        ...a,
        totalAnswered: mergeCounter(a.totalAnswered, b.totalAnswered),
        totalCorrect: mergeCounter(a.totalCorrect, b.totalCorrect),
        // A larger streak from an older device must not overwrite the newer day's count.
        streak: a.lastPlayed === b.lastPlayed ? Math.max(a.streak, b.streak) : laterPlayed === a.lastPlayed ? a.streak : b.streak,
        lastPlayed: laterPlayed,
        practiceDates: dates,
        gameRuns: runs,
        gameStats: stats,
        savedIds: [...new Set([...a.savedIds, ...b.savedIds])],
        missedIds: [...new Set([...a.missedIds, ...b.missedIds])],
        exploredIds: [...new Set([...a.exploredIds, ...b.exploredIds])],
        reviewSchedule: schedule,
        masteryLevels: { ...a.masteryLevels, ...b.masteryLevels },
        wordNotes: { ...a.wordNotes, ...b.wordNotes },
        level: b.level || a.level,
        accent: b.accent || a.accent,
        uiLanguage: b.uiLanguage || a.uiLanguage,
        glossLanguage: b.glossLanguage || a.glossLanguage,
        showGloss: b.showGloss || a.showGloss,
        theme: b.theme || a.theme,
        soundEnabled: b.soundEnabled || a.soundEnabled
      });
    }
    function mergeCloudSnapshot(progress, snapshot) {
      const profile = snapshot && snapshot.profile || {};
      const words = snapshot && Array.isArray(snapshot.wordbook) ? snapshot.wordbook : [];
      const scores = snapshot && Array.isArray(snapshot.scores) ? snapshot.scores : [];
      const cloudAnswered = scores.reduce((sum, row) => sum + (Number.isInteger(row.total) ? row.total : 0), 0);
      const cloudCorrect = scores.reduce((sum, row) => sum + (Number.isInteger(row.score) ? row.score : 0), 0);
      const cloudIds = words.map(row => row.word_id).filter(id => hasOwn(QUESTION_BY_ID, id));
      const cloudMastery = Object.fromEntries(words.filter(row => hasOwn(QUESTION_BY_ID, row.word_id) && ['Easy', 'Medium', 'Hard'].includes(row.mastery_level)).map(row => [row.word_id, row.mastery_level]));
      const cloudNotes = Object.fromEntries(words.filter(row => hasOwn(QUESTION_BY_ID, row.word_id) && typeof row.notes === 'string' && row.notes.trim()).map(row => [row.word_id, sanitizeUserText(row.notes, 500)]));
      const cloudDate = isDateKey(profile.last_active_date) ? profile.last_active_date : null;
      const latestDate = progress.lastPlayed && cloudDate ? (progress.lastPlayed > cloudDate ? progress.lastPlayed : cloudDate) : progress.lastPlayed || cloudDate;
      return sanitizeProgress({
        ...progress,
        totalAnswered: Math.max(progress.totalAnswered, cloudAnswered),
        totalCorrect: Math.max(progress.totalCorrect, cloudCorrect),
        streak: cloudDate === progress.lastPlayed
          ? Math.max(progress.streak, Number.isInteger(profile.streak_count) ? profile.streak_count : 0)
          : latestDate === cloudDate ? (Number.isInteger(profile.streak_count) ? profile.streak_count : 0) : progress.streak,
        lastPlayed: latestDate,
        level: ['beginner', 'intermediate', 'advanced', 'unsure'].includes(profile.english_level) ? profile.english_level : progress.level,
        uiLanguage: ['en', 'es', 'hi', 'bn', 'fr'].includes(profile.ui_language) ? profile.ui_language : progress.uiLanguage,
        glossLanguage: ['en', 'es', 'hi', 'bn', 'fr'].includes(profile.gloss_language) ? profile.gloss_language : progress.glossLanguage,
        showGloss: typeof profile.show_gloss === 'boolean' ? profile.show_gloss : progress.showGloss,
        savedIds: [...new Set([...progress.savedIds, ...cloudIds])],
        masteryLevels: { ...progress.masteryLevels, ...cloudMastery },
        wordNotes: { ...progress.wordNotes, ...cloudNotes }
      });
    }
    function applyRecoveredActivity() {
      const recovered = loadActiveSession();
      state.session = recovered.session;
      state.miniSession = recovered.miniSession;
      state.toneSession = recovered.toneSession;
      state.flashcardSession = null;
    }
    async function handleCloudUser(user, syncGuest = false) {
      if (!user || typeof user.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(user.id)) return;
      if (cloudLoadedUserId === user.id) return;
      if (cloudLoadingUserId === user.id && cloudLoadingPromise) { await cloudLoadingPromise; return; }
      if (cloudLoadingPromise) { try { await cloudLoadingPromise; } catch (error) { /* Continue with the newest session. */ } }
      cloudLoadingUserId = user.id;
      const task = (async () => {
        const previousUserId = currentUser && currentUser.id;
        const guestProgress = readGuestProgress();
        if (previousUserId !== user.id) {
          cloudLoadedUserId = null;
          persistActiveSession();
        }
        currentUser = user;
        if (previousUserId !== user.id) {
          state.progress = readProgressFromStorage(userProgressKey(user.id)) || sanitizeProgress(DEFAULT_PROGRESS);
          state.onboardingStep = state.progress.level ? 'level' : 'language';
          state.onboardingLevel = state.progress.level || null;
          state.onboardingLanguage = state.progress.level ? (state.progress.uiLanguage || 'en') : null;
          state.onboardingShowGloss = Boolean(state.progress.showGloss);
          applyRecoveredActivity();
          state.view = state.progress.level ? 'home' : 'onboarding';
        }
        updateAuthChrome();
        let guestWasSynced = guestSyncAlreadyDone(user.id);
        if (syncGuest && !guestWasSynced && hasGuestProgress(guestProgress)) {
          try {
            await cloudApi.syncGuestSnapshot(user.id, accountDisplayName(user), guestProgress);
            markGuestSyncDone(user.id);
            guestWasSynced = true;
            state.progress = mergeProgressData(state.progress, guestProgress, true);
            state.onboardingLevel = state.progress.level || null;
            state.onboardingLanguage = state.progress.uiLanguage || 'en';
            state.onboardingShowGloss = Boolean(state.progress.showGloss);
            if (state.view === 'onboarding' && state.progress.level) { state.view = 'home'; state.onboardingStep = 'level'; }
          } catch (error) {
            console.warn('Guest progress was not synced; the local copy is unchanged.', error);
            setAuthMessage('Guest sync did not finish. Your guest data is still on this device; you can retry from this dialog.', true);
          }
        }
        try {
          const cloudSnapshot = await cloudApi.fetchUserSnapshot(user.id);
          state.progress = mergeCloudSnapshot(state.progress, cloudSnapshot);
          cloudLoadedUserId = user.id;
          setAuthMessage(`Signed in as ${accountDisplayName(user)}. Cloud progress is up to date.`);
        } catch (error) {
          console.warn('Could not load cloud progress; using this account’s local cache.', error);
          setAuthMessage('Signed in, but cloud data is unavailable. Changes stay on this device until sync resumes.', true);
        }
        state.onboardingLevel = state.progress.level || null;
        state.onboardingLanguage = state.progress.level ? (state.progress.uiLanguage || 'en') : (state.onboardingLanguage || null);
        state.onboardingShowGloss = Boolean(state.progress.showGloss);
        if (state.view === 'onboarding' && state.progress.level) { state.view = 'home'; state.onboardingStep = 'level'; }
        saveProgress();
        render();
        updateAuthChrome();
      })();
      cloudLoadingPromise = task;
      try { await task; }
      finally {
        if (cloudLoadingUserId === user.id) cloudLoadingUserId = null;
        if (cloudLoadingPromise === task) cloudLoadingPromise = null;
      }
    }
    async function syncGuestDataNow() {
      if (!currentUser || !cloudApi || !cloudApi.isSupabaseReady) { setAuthMessage('Cloud sync is not available yet.', true); return; }
      const guest = readGuestProgress();
      if (!hasGuestProgress(guest)) { setAuthMessage('There is no guest progress on this device to sync.'); updateAuthChrome(); return; }
      const user = currentUser;
      setAuthMessage('Syncing guest progress…');
      try {
        await cloudApi.syncGuestSnapshot(user.id, accountDisplayName(user), guest);
        markGuestSyncDone(user.id);
        const snapshot = await cloudApi.fetchUserSnapshot(user.id);
        cloudLoadedUserId = user.id;
        state.progress = mergeProgressData(state.progress, guest, true);
        state.progress = mergeCloudSnapshot(state.progress, snapshot);
        saveProgress();
        render();
        updateAuthChrome();
        setAuthMessage('Guest progress synced to your account.');
      } catch (error) {
        console.warn('Manual guest sync failed.', error);
        setAuthMessage('Sync failed. Your guest progress is still saved on this device; try again later.', true);
      }
    }
    function handleCloudSignOut() {
      const previousUser = currentUser;
      if (previousUser) {
        try { localStorage.setItem(userProgressKey(previousUser.id), JSON.stringify(state.progress)); } catch (error) { /* Cloud account cache is optional. */ }
      }
      currentUser = null;
      cloudLoadedUserId = null;
      clearTimeout(cloudSyncTimer);
      state.progress = readGuestProgress();
      state.onboardingStep = state.progress.level ? 'level' : 'language';
      state.onboardingLevel = state.progress.level || null;
      state.onboardingLanguage = state.progress.level ? (state.progress.uiLanguage || 'en') : null;
      state.onboardingShowGloss = Boolean(state.progress.showGloss);
      applyRecoveredActivity();
      state.view = state.progress.level ? 'home' : 'onboarding';
      render();
      updateAuthChrome();
      setAuthMessage('Signed out. Guest progress remains on this device.');
    }
    async function runAccountAction(mode) {
      const emailField = document.getElementById('auth-email');
      const passwordField = document.getElementById('auth-password');
      const usernameField = document.getElementById('auth-username');
      const syncField = document.getElementById('sync-guest');
      const email = String(emailField && emailField.value || '').trim();
      const password = String(passwordField && passwordField.value || '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) { setAuthMessage('Enter a valid email address.', true); return; }
      if (password.length < 8 || password.length > 128) { setAuthMessage('Use a password between 8 and 128 characters.', true); return; }
      pendingGuestSync = Boolean(syncField && syncField.checked);
      setAuthMessage(mode === 'signup' ? 'Creating your account…' : 'Signing in…');
      try {
        const modules = await loadCloudModules();
        if (!modules.auth.isSupabaseReady) { setAuthMessage('Cloud accounts are not configured or the CDN is unavailable. Guest mode still works.', true); return; }
        const result = mode === 'signup'
          ? await modules.auth.signUpWithEmail(email, password, sanitizeUserText(usernameField && usernameField.value || '', 40).trim())
          : await modules.auth.signInWithEmail(email, password);
        const user = result && result.session && result.session.user || result && result.user;
        passwordField.value = '';
        if (user && (mode === 'signin' || result.session)) {
          await handleCloudUser(user, pendingGuestSync);
          closeAuthDialog();
          pendingGuestSync = false;
        } else if (mode === 'signup') {
          setAuthMessage('Account created. Check your email to confirm it, then sign in. Guest progress remains on this device.');
        } else {
          setAuthMessage('Sign-in did not return an account. Check your credentials and try again.', true);
        }
      } catch (error) {
        const message = error && typeof error.message === 'string' ? error.message : 'Account request failed. Please try again.';
        setAuthMessage(sanitizeUserText(message, 240), true);
      }
    }
    function setupAuthControls() {
      const button = document.getElementById('auth-button');
      const close = document.getElementById('auth-close');
      const dialog = document.getElementById('auth-dialog');
      const form = document.getElementById('auth-form');
      const signup = document.getElementById('auth-signup');
      const signout = document.getElementById('auth-signout');
      const syncNow = document.getElementById('auth-sync-now');
      if (button) button.addEventListener('click', openAuthDialog);
      if (close) close.addEventListener('click', closeAuthDialog);
      if (dialog) dialog.addEventListener('click', event => { if (event.target === dialog) closeAuthDialog(); });
      if (form) form.addEventListener('submit', event => { event.preventDefault(); runAccountAction('signin'); });
      if (signup) signup.addEventListener('click', () => runAccountAction('signup'));
      if (signout) signout.addEventListener('click', async () => {
        try { if (!cloudAuth) await loadCloudModules(); if (cloudAuth && cloudAuth.isSupabaseReady) await cloudAuth.signOut(); handleCloudSignOut(); closeAuthDialog(); }
        catch (error) { setAuthMessage('Could not sign out. Check your connection and try again.', true); }
      });
      if (syncNow) syncNow.addEventListener('click', syncGuestDataNow);
      updateAuthChrome();
    }
    async function initializeCloudAccounts() {
      try {
        const modules = await loadCloudModules();
        if (!modules.auth.isSupabaseReady) return;
        modules.auth.subscribeToAuthChanges((event, session) => {
          if (session && session.user) handleCloudUser(session.user, pendingGuestSync).catch(error => console.warn('Account data load failed.', error));
          else if (event === 'SIGNED_OUT' && currentUser) handleCloudSignOut();
        });
        const session = await modules.auth.getCurrentSession();
        if (session && session.user) await handleCloudUser(session.user, false);
      } catch (error) {
        console.warn('Account integration could not start; continuing in guest mode.', error);
        setAuthMessage('Cloud is unavailable. Your local guest progress still works.');
      }
      updateAuthChrome();
    }

    initializeSpeechVoices();
    setupAuthControls();
    render();
    initializeCloudAccounts();
    })();
