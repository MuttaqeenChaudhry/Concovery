<script setup lang="ts">
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE DEFINITIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface Stage {
  id: number
  name: string
  shortName: string
  days: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THE 6 AIS RECOVERY STAGES
// These are the official Australian Institute of Sport stages.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const stages: Stage[] = [
  { id: 1, name: 'Complete Rest',           shortName: 'Rest',           days: '1-3'   },
  { id: 2, name: 'Light Aerobic',           shortName: 'Light Aerobic',  days: '4-6'   },
  { id: 3, name: 'Sport Specific Exercise', shortName: 'Sport Specific', days: '7-9'   },
  { id: 4, name: 'Non-Contact Training',    shortName: 'Non-Contact',    days: '10-14' },
  { id: 5, name: 'Full Contact',            shortName: 'Full Contact',   days: '15-20' },
  { id: 6, name: 'Return to Play',          shortName: 'Return to Play', days: '21+'   },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXERCISE DEFINITIONS
// Just the names and numbers used for the modal preview list.
// The actual guided exercise logic lives in ExercisePage.vue.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const exerciseDefinitions = [
  { name: 'Chin Tucks',      sets: 3, reps: 10 },
  { name: 'Neck Rotations',  sets: 1, reps: 10 },
  { name: 'Neck Isometrics', sets: 3, reps: 8  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 21-DAY DATA
// One entry per day. Each entry has:
//   stage / stageName       the AIS stage this day belongs to
//   brainRecoveryPct        estimated brain recovery percentage from research
//   cellularProcess         what is happening in the brain right now
//   dailyGoal               the one thing the user should focus on today
//   allowed                 activities that are safe to do
//   restricted              things to avoid today
//   warningSign             symptoms that mean stop and see a doctor
//   insight                 a useful fact or motivation for the day
//
// Source: Giza and Hovda 2014 (Neurometabolic Cascade), AIS 2024 Return to Play Protocol
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const dayData: Record<number, {
  stage: number; stageName: string; brainRecoveryPct: number
  cellularProcess: string; dailyGoal: string
  allowed: { activity: string; detail: string; interactive?: string }[]
  restricted: string[]; warningSign: string; insight: string
}> = {
  1: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 5,
    cellularProcess: 'Your brain is in a neurometabolic crisis right now. Ion pumps are working overtime to restore balance. Glucose demand is at its peak but blood flow is disrupted, so supply cannot keep up.',
    dailyGoal: 'Do absolutely nothing today. Every resource your brain has needs to go toward stabilising.',
    allowed: [
      { activity: 'Sleep', detail: 'Sleep as much as you can. It is the most powerful recovery tool available on Day 1.' },
      { activity: 'Guided rest breathing', detail: '4-7-8 breathing lowers your cognitive load and supports neurological recovery.', interactive: 'breathing' },
      { activity: 'Lying in a dark room', detail: 'Reduce all sensory input. Close the blinds, no TV, no phone.' },
      { activity: 'Light meals', detail: 'Eat if you can manage it. No caffeine and no alcohol.' },
    ],
    restricted: ['No screens at all, including phone, TV, laptop and tablet', 'No reading of any kind', 'No physical activity', 'No driving', 'No school or work tasks', 'No loud environments or bright lights'],
    warningSign: 'If your headache gets worse, you vomit, or you lose consciousness, call 000 immediately.',
    insight: 'You might feel like you are doing nothing useful. You are not. Resting on Day 1 is the most active recovery decision you can make.',
  },
  2: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 10,
    cellularProcess: 'Ion balance is starting to come back but energy reserves are still critically low. The inflammatory response is at its peak and neurons are extremely vulnerable to a second injury right now.',
    dailyGoal: 'Keep resting. If symptoms seem to be easing, do not be fooled. Your brain is still in crisis.',
    allowed: [
      { activity: 'Sleep and rest', detail: 'Sleep is still your number one priority.' },
      { activity: 'Guided rest breathing', detail: 'Breathing exercises lower stress hormones that slow brain recovery.', interactive: 'breathing' },
      { activity: 'Short walks to the bathroom', detail: 'Minimal movement only. Do not exert yourself.' },
      { activity: 'Brief calm conversation', detail: 'Light conversation is fine. Keep it low stress.' },
    ],
    restricted: ['No screens', 'No physical exertion', 'No driving', 'No school or work', 'No alcohol'],
    warningSign: 'If symptoms are noticeably worse than yesterday, see a GP today and do not wait.',
    insight: 'Day 2 is when most players want to grab their phone. Do not. Your neurons need the energy that screen time steals.',
  },
  3: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 15,
    cellularProcess: 'The inflammatory response is beginning to settle. Mitochondria are starting to restore ATP production and blood flow is slowly coming back, though it is still below normal.',
    dailyGoal: 'If you are completely symptom free, you can try very gentle cognitive activity. If any symptoms remain, keep resting.',
    allowed: [
      { activity: 'Short screen time if symptom free', detail: 'Maximum 15 minutes at a time and only if you have no headache.' },
      { activity: 'Guided rest breathing', detail: 'Keep up your daily breathing practice.', interactive: 'breathing' },
      { activity: 'Light reading', detail: 'Only if you are completely symptom free. Stop immediately if a headache returns.' },
      { activity: 'Short walk outdoors', detail: '5 to 10 minutes at a slow pace. Stop if anything feels off.' },
    ],
    restricted: ['No sport or physical training', 'No driving', 'No full time school or work', 'No alcohol', 'No activities that raise your heart rate'],
    warningSign: 'Any return of headache, dizziness or brain fog means go straight back to complete rest.',
    insight: 'Being symptom free does not mean your brain has healed. You are at 15% recovery. Stage 2 starts tomorrow.',
  },
  4: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 22,
    cellularProcess: 'Mitochondrial recovery is underway. ATP production is improving but still 40% below normal. Inflammation is decreasing and axons are starting early stage repair.',
    dailyGoal: 'Introduce light aerobic activity that keeps your heart rate below 60% of your maximum.',
    allowed: [
      { activity: 'Walking', detail: '10 to 15 minutes at a comfortable pace. If you can hold a conversation, the pace is right.' },
      { activity: 'Gentle stretching', detail: '10 minutes of light static stretching only. No dynamic movements.' },
      { activity: 'Guided rest breathing', detail: 'Keep up your daily breathing practice.', interactive: 'breathing' },
      { activity: 'Cognitive load test', detail: 'The daily digit span test tracks how your cognitive speed is recovering.', interactive: 'cognitive' },
      { activity: 'School or work at reduced load', detail: 'Half days only. Take a break every 30 minutes.' },
    ],
    restricted: ['No running or jogging', 'No gym or weight training', 'No contact of any kind', 'No activities that cause sweating or raise your heart rate significantly', 'No alcohol'],
    warningSign: 'Stop immediately if headache, dizziness or nausea comes back during or after activity.',
    insight: 'Light movement actually helps recovery by increasing blood flow to your brain. The moment symptoms return, stop.',
  },
  5: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 28,
    cellularProcess: 'Blood flow is normalising. Mitochondria are producing ATP more efficiently. Axonal repair is active and neurotransmitter levels are starting to restabilise.',
    dailyGoal: 'Extend your aerobic activity by about 5 minutes compared to yesterday, if you are still symptom free.',
    allowed: [
      { activity: 'Walking', detail: '15 to 20 minutes at a slightly brisker pace than yesterday, if it feels comfortable.' },
      { activity: 'Stationary bike', detail: '10 minutes at very low resistance. Keep heart rate below 60% of your max.' },
      { activity: 'Cognitive load test', detail: 'Compare your score to yesterday to track how your brain speed is coming back.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'A light cognitive challenge to track how quickly your brain is responding.', interactive: 'reaction' },
    ],
    restricted: ['No running', 'No resistance training', 'No contact sport', 'No high intensity activity'],
    warningSign: 'Feeling tired after light activity is normal. A headache is not. Stop if it appears.',
    insight: 'You are at 28% recovery. Do not confuse your symptoms clearing up with your brain being healed. They are different things.',
  },
  6: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 34,
    cellularProcess: 'Energy metabolism is at about 35% of your normal level. Axonal connections are stabilising in undamaged areas and inflammation has largely resolved around the edges.',
    dailyGoal: 'This is your last day of Stage 2. Prepare to introduce sport specific movement tomorrow.',
    allowed: [
      { activity: 'Brisk walking', detail: '20 to 25 minutes. You should feel warmer but not out of breath.' },
      { activity: 'Stationary bike', detail: '15 minutes at low resistance. Heart rate can briefly touch 65% of your max.' },
      { activity: 'Swimming at easy pace', detail: 'No flip turns and no diving. Easy freestyle only.' },
      { activity: 'Cognitive load test', detail: 'A final Stage 2 cognitive check before you move forward.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Track your cognitive recovery progress.', interactive: 'reaction' },
    ],
    restricted: ['No running or jogging', 'No sport specific drills', 'No weight training', 'No contact'],
    warningSign: 'If symptoms return today, reset to Day 4. Do not push yourself into Stage 3.',
    insight: 'Tomorrow you move to Stage 3. Trusting the process when you feel fine is exactly what protects your long term brain health.',
  },
  7: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 40,
    cellularProcess: 'Axonal connections are regenerating in the damaged regions. Energy metabolism is at 40%, which is enough for moderate exercise but not enough to protect you from a collision. Myelin sheath repair is just beginning.',
    dailyGoal: 'Introduce running and sport specific movement today, but with zero contact or collision risk.',
    allowed: [
      { activity: 'Light jogging', detail: '10 to 15 minutes at a pace where you can still hold a conversation. On grass if possible.' },
      { activity: 'Dribbling or ball skills', detail: 'Solo drills only, no other players involved.' },
      { activity: 'Cognitive load test', detail: 'Track your brain speed as your physical load increases.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive recovery check.', interactive: 'reaction' },
    ],
    restricted: ['No contact or collision of any kind', 'No team training with other players', 'No heading the ball', 'No weight training', 'No match play or scrimmage'],
    warningSign: 'This is the most dangerous day of your recovery. You feel about 90% fine but your brain is at 40%. Do not be fooled.',
    insight: 'This is the Day 7 trap. Axonal connections in the damaged area are still regenerating and they are highly susceptible to re-injury right now.',
  },
  8: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 46,
    cellularProcess: 'Myelin sheath repair is progressing. Neural pathway efficiency is improving but not restored yet. Energy reserves are building but still well below your pre-injury baseline.',
    dailyGoal: 'Build on yesterday. Extend how long you train and add a little more skill complexity.',
    allowed: [
      { activity: 'Jogging', detail: '15 to 20 minutes with gentle direction changes included.' },
      { activity: 'Sport specific skills', detail: 'Passing drills and shooting practice, solo or with a stationary partner.' },
      { activity: 'Cognitive load test', detail: 'Your daily digit span test.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily reaction test tracking your cognitive recovery.', interactive: 'reaction' },
    ],
    restricted: ['No contact', 'No team training', 'No explosive plyometric movements', 'No heading the ball'],
    warningSign: 'If fatigue lasts more than an hour after training, reduce the intensity tomorrow.',
    insight: 'Consistency across Days 7, 8 and 9 matters more than how hard any one session is.',
  },
  9: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 52,
    cellularProcess: 'Over 50% of neurometabolic function has been restored. Axonal connections are largely re-established in the damaged areas, though vulnerability to a second injury is still significantly elevated.',
    dailyGoal: 'Push movement complexity to its limit today but keep the strict no contact rule in place.',
    allowed: [
      { activity: 'Running', detail: '20 to 25 minutes including direction changes and moderate acceleration.' },
      { activity: 'Complex sport drills', detail: 'Multi-player passing, controlled shooting and position specific patterns.' },
      { activity: 'Upper body resistance training', detail: 'Light weights only with controlled movements. No maximum effort.' },
      { activity: 'Cognitive load test', detail: 'Check your cognitive speed before moving to Stage 4.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact at all', 'No collision drills', 'No heading', 'No maximum sprint efforts'],
    warningSign: 'If you are symptom free at the end of today you are ready for Stage 4 tomorrow.',
    insight: 'You are past the halfway point. Over 50% of neurometabolic function is restored.',
  },
  10: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 58,
    cellularProcess: 'Significant neurometabolic recovery is underway. Energy systems are approaching 60% of normal. Axonal integrity is largely restored and your brain can now handle a higher physical and cognitive load.',
    dailyGoal: 'Return to full team training today but with zero contact.',
    allowed: [
      { activity: 'Full team training without contact', detail: 'Train with teammates at normal intensity. Step out of any contact drills.' },
      { activity: 'High intensity running', detail: 'Sprints, intervals and shuttle runs. Push your cardiovascular system.' },
      { activity: 'Weight training', detail: 'Progressive resistance is fine. Avoid heavy neck loading.' },
      { activity: 'Cognitive load test', detail: 'Track cognitive recovery as your physical load increases.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact or tackling', 'No collision drills', 'No heading', 'No match play'],
    warningSign: 'Being back in the team environment creates pressure to make contact. Stick to the protocol.',
    insight: 'At 58% recovery your brain cannot handle a second impact. Second impact syndrome is still a real risk.',
  },
  11: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 63,
    cellularProcess: 'Neural pathway efficiency is approaching 65%. Neurotransmitter levels are largely back to normal and cognitive function has recovered significantly.',
    dailyGoal: 'Match your pre-injury training intensity in all non-contact areas today.',
    allowed: [
      { activity: 'Full training drills', detail: 'Participate in every drill that does not involve physical contact.' },
      { activity: 'Tactical training', detail: 'Team formations, set pieces and tactical movements. Fully participate.' },
      { activity: 'Full gym session', detail: 'Normal weight training is fine. Avoid neck loading exercises.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No tackling', 'No physical contests', 'No heading', 'No match simulation with contact'],
    warningSign: 'If you feel cognitive fatigue during training, reduce your load.',
    insight: 'At 63% you are capable of playing. But being capable is not the same as being ready.',
  },
  12: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 67,
    cellularProcess: 'Myelin sheath repair is over 70% complete. Energy metabolism is at roughly two thirds of your pre-injury baseline.',
    dailyGoal: 'Sustain high intensity non-contact training throughout the session today.',
    allowed: [
      { activity: 'High intensity interval training', detail: 'A full HIIT session. Your cardiovascular system can handle it.' },
      { activity: 'Technical skill work at full speed', detail: 'Ball skills, footwork and positional drills at match pace.' },
      { activity: 'Full gym session', detail: 'All exercises are fine except direct neck loading.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact', 'No heading', 'No match play'],
    warningSign: 'A headache during high intensity exercise means reduce your load and reassess.',
    insight: 'Three more days of non-contact training. This discipline is what separates full recoveries from persistent symptoms.',
  },
  13: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 72,
    cellularProcess: 'Axonal repair is about 75% complete. The remaining vulnerable regions are in the deeper white matter tracts.',
    dailyGoal: 'Push training intensity to its absolute limit within the no contact rule.',
    allowed: [
      { activity: 'Match intensity training', detail: 'Every drill at full match pace, except contact.' },
      { activity: 'Plyometrics', detail: 'Explosive jumps, bounds and direction changes at full speed.' },
      { activity: 'Full team session', detail: 'Lead drills and play your position. Step out only when contact is unavoidable.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No contact or tackling', 'No heading', 'No match play'],
    warningSign: 'Any symptom at this stage means you need an immediate medical review.',
    insight: 'You are doing everything at match pace except making contact. You are 72% recovered with 8 days until clearance.',
  },
  14: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 76,
    cellularProcess: 'White matter tract repair is about 80% complete. Your brain is approaching the threshold where it can safely absorb contact forces.',
    dailyGoal: 'Final non-contact session today. Confirm you are symptom free before progressing to Stage 5.',
    allowed: [
      { activity: 'All non-contact training', detail: 'Full participation at match intensity.' },
      { activity: 'Pre-contact preparation drills', detail: 'Controlled technique without impact, if supervised by a coach.' },
      { activity: 'Cognitive load test', detail: 'Final cognitive check before the contact phase begins.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No full contact', 'No heading', 'No match play'],
    warningSign: 'You must be completely symptom free at rest and during exercise before you can move on tomorrow.',
    insight: 'Day 14 symptom free. Tomorrow is a real milestone.',
  },
  15: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 80,
    cellularProcess: 'Your brain structure is now stable enough to absorb controlled contact forces. Axonal repair is 85% complete and energy metabolism is at 80% of normal.',
    dailyGoal: 'Reintroduce controlled contact today in a supervised training environment.',
    allowed: [
      { activity: 'Controlled contact training', detail: 'Tackle practice at reduced intensity. Let your coach know this is your first contact session back.' },
      { activity: 'Full team training with contact', detail: 'Participate fully but speak up immediately if anything feels off.' },
      { activity: 'Contested marking or ruck work', detail: 'Physical contests at moderate intensity.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['No match play until you have medical clearance', 'No heading in training', 'Do not return without telling your coach about your concussion history'],
    warningSign: 'Any headache or dizziness during contact drills means stop immediately and return to Stage 4.',
    insight: 'Tell your coach and teammates this is your first contact session post-concussion. Being open about it protects you.',
  },
  16: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 84,
    cellularProcess: 'Contact forces are being absorbed without triggering a symptom cascade. Deep white matter repair is still ongoing.',
    dailyGoal: 'Progress your contact intensity today if yesterday was completely symptom free.',
    allowed: [
      { activity: 'Full contact training at normal intensity', detail: 'If Day 15 was symptom free, train at your normal match preparation intensity.' },
      { activity: 'Match simulation drills', detail: 'Contested situations and game scenarios at full physical intensity.' },
      { activity: 'Heading practice', detail: 'You can reintroduce controlled heading if your sport requires it and you are symptom free.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No match play until you have medical clearance', 'Do not hide any symptoms from your coach or medical staff'],
    warningSign: 'Symptoms on Day 16 after contact means return to Stage 4 and get a medical review.',
    insight: 'At 84% you are very close to full health. The remaining 16% continues repairing for weeks after you return.',
  },
  17: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 87,
    cellularProcess: 'Axonal repair is approaching 90% completion. Energy metabolism is at 87% of your pre-injury baseline.',
    dailyGoal: 'Full training at match intensity today including all contact situations.',
    allowed: [
      { activity: 'Full contact training', detail: 'All drills at match intensity with no restrictions on contact type.' },
      { activity: 'Contested situations', detail: 'Marking contests, tackles and physical duels at full intensity.' },
      { activity: 'Heading', detail: 'Fine if your sport requires it and you are completely symptom free.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No match play until Day 21 medical clearance'],
    warningSign: 'Four days until you return. Do not take risks that could push your timeline back.',
    insight: 'Players who complete every day of the protocol come back at 100%. Those who rush come back at 80%.',
  },
  18: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 90,
    cellularProcess: 'Over 90% neurometabolic recovery. Your brain is functionally restored for sporting activity.',
    dailyGoal: 'Simulate match conditions as closely as possible in training today.',
    allowed: [
      { activity: 'Match simulation', detail: 'Intra-squad games and practice matches at full intensity with full contact.' },
      { activity: 'All training activities', detail: 'No restrictions in the training environment.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No official match play until medical clearance on Day 21'],
    warningSign: 'Three days from clearance. Any symptom now needs a medical review.',
    insight: 'You are 90% recovered. The final 10% continues for weeks after you return. That is completely normal.',
  },
  19: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 93,
    cellularProcess: 'Neurometabolic function is at 93%. Your brain is performing at near-normal levels under physical load.',
    dailyGoal: 'Final preparation before medical clearance. Train with confidence today.',
    allowed: [
      { activity: 'Full unrestricted training', detail: 'Everything except official match play.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['No official competition until you have medical clearance'],
    warningSign: 'Two days from clearance. No unnecessary risks.',
    insight: 'Most players do not make it this far without cutting corners. You have done it the right way.',
  },
  20: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 96,
    cellularProcess: 'All primary axonal repair is complete. White matter integrity is restored. Your brain is ready for full competition after medical clearance.',
    dailyGoal: 'Final training day before your medical clearance assessment tomorrow.',
    allowed: [
      { activity: 'All training activities', detail: 'Train as if tomorrow is match day.' },
      { activity: 'Cognitive load test', detail: 'Final cognitive check before clearance.', interactive: 'cognitive' },
    ],
    restricted: ['No official match play until after medical clearance on Day 21'],
    warningSign: 'Any symptom today delays your clearance. See a doctor immediately.',
    insight: 'One day until clearance. You have protected your brain for 20 days. Tomorrow you return stronger.',
  },
  21: {
    stage: 6, stageName: 'Return to Play', brainRecoveryPct: 100,
    cellularProcess: 'Full neurometabolic recovery. Energy systems are back to baseline. Axonal integrity is complete. Your brain is fully prepared for competitive sport.',
    dailyGoal: 'Get your medical clearance today and return to full competition.',
    allowed: [
      { activity: 'Medical clearance assessment', detail: 'See your GP or sports medicine doctor for formal sign-off before you return.' },
      { activity: 'Full return to competition', detail: 'Once medically cleared, you can play without any restrictions.' },
      { activity: 'All sport activities', detail: 'No limitations. You are fully recovered.' },
    ],
    restricted: ['Do not return without medical clearance, it is a legal and safety requirement', 'Do not play through any symptoms that come back after returning', 'Do not hide future concussions from your coaching staff'],
    warningSign: 'If symptoms come back after you return to play, stop immediately and restart the protocol.',
    insight: 'You did it. 21 days. Every player who completes the full protocol comes back at 100%. Welcome back.',
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 1 — DATE AND DAY TRACKING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const injuryDate      = ref('')
const daysSinceInjury = ref<number | null>(null)
const selectedDay     = ref<number | null>(null)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 2 — CALENDAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const showCalendar  = ref(false)
const today         = new Date()
const calendarMonth = ref(today.getMonth())
const calendarYear  = ref(today.getFullYear())
const monthNames    = ['January','February','March','April','May','June','July','August','September','October','November','December']

const calendarDaysInMonth = computed(() => new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate())
const calendarStartDay    = computed(() => new Date(calendarYear.value, calendarMonth.value, 1).getDay())
const isNextMonthDisabled = computed(() => calendarYear.value === today.getFullYear() && calendarMonth.value >= today.getMonth())

function prevMonth() {
  if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- }
  else calendarMonth.value--
}
function nextMonth() {
  if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ }
  else calendarMonth.value++
}
function isFutureDay(day: number) { return new Date(calendarYear.value, calendarMonth.value, day) > today }
function isToday(day: number) {
  return day === today.getDate() && calendarMonth.value === today.getMonth() && calendarYear.value === today.getFullYear()
}
function isSelectedCalDay(day: number) {
  if (!injuryDate.value) return false
  const d = new Date(injuryDate.value)
  return day === d.getDate() && calendarMonth.value === d.getMonth() && calendarYear.value === d.getFullYear()
}
function selectCalendarDate(day: number) {
  const d    = new Date(calendarYear.value, calendarMonth.value, day)
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  injuryDate.value   = `${yyyy}-${mm}-${dd}`
  showCalendar.value = false
}
function formatDisplayDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 3 — CHECK-IN MODAL
//
// How the flow works:
//   Step 1: Sleep quality
//   Step 2: Symptom check
//   Step 3: Neck exercises (Stage 2 and above only)
//           Clicking "Start exercises" goes to /exercises (ExercisePage.vue)
//           ExercisePage sets a flag in localStorage when done
//           When the user comes back, the modal reopens at the journal step
//   Step 4: Recovery journal (or Step 3 on Stage 1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const showCheckInModal = ref(false)
const checkInStep      = ref(1)

const totalCheckInSteps = computed(() => {
  return currentStage.value && currentStage.value >= 2 ? 4 : 3
})

function openCheckIn() {
  showCheckInModal.value   = true
  checkInStep.value        = 1
  symptomStep.value        = 0
  symptomAnswers.value     = [null, null, null]
  showSymptomSection.value = false
}
function closeCheckIn() { showCheckInModal.value = false }
function nextCheckInStep() {
  if (checkInStep.value < totalCheckInSteps.value) checkInStep.value++
  else closeCheckIn()
}
function prevCheckInStep() {
  if (checkInStep.value > 1) checkInStep.value--
}

// Takes the user to the exercise page and saves a flag so
// the modal knows to reopen at the journal step when they come back
function goToExercises() {
  localStorage.setItem('concovery_return_modal', 'true')
  closeCheckIn()
  router.push('/exercises')
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 4 — SLEEP CHECK-IN
// Three consecutive nights of poor sleep triggers a GP warning.
// Saved to localStorage under 'concovery_sleep'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const sleepQuality   = ref<'well' | 'okay' | 'poorly' | null>(null)
const sleepHistory   = ref<{ date: string; quality: string; day: number }[]>([])
const sleepSubmitted = ref(false)

const consecutivePoorSleep = computed(() => {
  if (sleepHistory.value.length < 3) return false
  return sleepHistory.value.slice(-3).every(s => s.quality === 'poorly')
})

function submitSleep(quality: 'well' | 'okay' | 'poorly') {
  sleepQuality.value   = quality
  sleepSubmitted.value = true
  const entry  = { date: new Date().toISOString().split('T')[0], quality, day: daysSinceInjury.value || 1 }
  const existing = sleepHistory.value.findIndex(s => s.date === entry.date)
  if (existing >= 0) sleepHistory.value[existing] = entry
  else               sleepHistory.value.push(entry)
  localStorage.setItem('concovery_sleep', JSON.stringify(sleepHistory.value))
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 5 — SYMPTOM CHECK
// One question at a time. If the user answers yes to any question,
// it jumps straight to the result without asking the rest.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const symptomStep        = ref(0)
const symptomAnswers     = ref<(boolean | null)[]>([null, null, null])
const symptomQuestions   = ['Do you have a headache?', 'Any dizziness or balance issues?', 'Difficulty concentrating?']
const showSymptomSection = ref(false)

function startSymptomCheck() {
  showSymptomSection.value = true
  symptomStep.value        = 1
}
function answerSymptom(answer: boolean) {
  const idx = symptomStep.value - 1
  symptomAnswers.value[idx] = answer
  if (answer === true)            symptomStep.value = 4
  else if (symptomStep.value < 3) symptomStep.value++
  else                            symptomStep.value = 4
}
function resetSymptoms() {
  symptomStep.value    = 1
  symptomAnswers.value = [null, null, null]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 6 — ACTIVITY CHECKLIST
// Non-interactive activities can be ticked off as done.
// Key format is "dayNumber-activityName", for example "7-Light jogging"
// Saved to localStorage under 'concovery_activities'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const checkedActivities = ref<Record<string, boolean>>({})

function toggleActivity(key: string) {
  checkedActivities.value[key] = !checkedActivities.value[key]
  localStorage.setItem('concovery_activities', JSON.stringify(checkedActivities.value))
}
function isActivityChecked(key: string) { return checkedActivities.value[key] || false }

// Pick the right icon for each activity based on its name
function getActivityIcon(activityName: string): string {
  const name = activityName.toLowerCase()
  if (name.includes('sleep'))                                           return 'sleep'
  if (name.includes('breath'))                                          return 'breathing'
  if (name.includes('cognitive') || name.includes('digit'))            return 'cognitive'
  if (name.includes('reaction'))                                        return 'reaction'
  if (name.includes('walk') || name.includes('jog') || name.includes('run')) return 'movement'
  if (name.includes('swim'))                                            return 'swim'
  if (name.includes('bike') || name.includes('cycling'))               return 'bike'
  if (name.includes('gym') || name.includes('weight') || name.includes('hiit') || name.includes('resistance') || name.includes('plyometric')) return 'gym'
  if (name.includes('stretch'))                                         return 'stretch'
  if (name.includes('school') || name.includes('work') || name.includes('read')) return 'study'
  if (name.includes('tactical') || name.includes('drill') || name.includes('skill') || name.includes('ball') || name.includes('dribble') || name.includes('pass')) return 'sport'
  if (name.includes('medical') || name.includes('clearance'))          return 'medical'
  if (name.includes('conversation') || name.includes('lying') || name.includes('meal') || name.includes('rest')) return 'rest'
  return 'default'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 7 — BREATHING EXERCISE (4-7-8 technique)
// Three cycles of: inhale 4 seconds, hold 7 seconds, exhale 8 seconds
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const breathingActive   = ref(false)
const breathingPhase    = ref<'inhale' | 'hold' | 'exhale' | 'idle'>('idle')
const breathingCount    = ref(0)
const breathingCycles   = ref(0)
const breathingProgress = ref(0)
let breathingInterval: ReturnType<typeof setInterval> | null = null

function startBreathing() {
  breathingActive.value = true
  breathingCycles.value = 0
  runBreathingCycle()
}

function runBreathingCycle() {
  breathingPhase.value    = 'inhale'
  breathingCount.value    = 4
  breathingProgress.value = 0
  let elapsed = 0
  breathingInterval = setInterval(() => {
    elapsed++
    breathingProgress.value = (elapsed / 4) * 100
    breathingCount.value    = 4 - elapsed
    if (elapsed >= 4) {
      clearInterval(breathingInterval!)
      breathingPhase.value = 'hold'; breathingCount.value = 7; breathingProgress.value = 0; elapsed = 0
      breathingInterval = setInterval(() => {
        elapsed++
        breathingProgress.value = (elapsed / 7) * 100
        breathingCount.value    = 7 - elapsed
        if (elapsed >= 7) {
          clearInterval(breathingInterval!)
          breathingPhase.value = 'exhale'; breathingCount.value = 8; breathingProgress.value = 0; elapsed = 0
          breathingInterval = setInterval(() => {
            elapsed++
            breathingProgress.value = (elapsed / 8) * 100
            breathingCount.value    = 8 - elapsed
            if (elapsed >= 8) {
              clearInterval(breathingInterval!)
              breathingCycles.value++
              if (breathingCycles.value < 3) runBreathingCycle()
              else { breathingPhase.value = 'idle'; breathingActive.value = false; breathingProgress.value = 100 }
            }
          }, 1000)
        }
      }, 1000)
    }
  }, 1000)
}

function stopBreathing() {
  if (breathingInterval) clearInterval(breathingInterval)
  breathingActive.value   = false
  breathingPhase.value    = 'idle'
  breathingProgress.value = 0
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 8 — COGNITIVE LOAD TEST (Digit Span)
// Based on the SCAT5 digit span test used in clinical concussion assessments.
// Digits flash one at a time. The user has to recall them in order.
// Sequence length gets longer as recovery progresses.
// Saved to localStorage under 'concovery_cognitive'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const cognitivePhase        = ref<'idle' | 'showing' | 'input' | 'result'>('idle')
const cognitiveSequence     = ref<number[]>([])
const cognitiveCurrentIndex = ref(0)
const cognitiveInput        = ref<number[]>([])
const cognitiveResult       = ref<'correct' | 'incorrect' | null>(null)
const cognitiveHistory      = ref<{ day: number; date: string; length: number; correct: boolean }[]>([])
const cognitiveShowDigit    = ref<number | null>(null)
let cognitiveTimeout: ReturnType<typeof setTimeout> | null = null

function getDigitSpanLength(day: number): number {
  if (day <= 6)  return 3
  if (day <= 9)  return 4
  if (day <= 14) return 5
  if (day <= 20) return 6
  return 7
}

function startCognitiveTest() {
  const length             = getDigitSpanLength(viewingDay.value || 1)
  cognitiveSequence.value  = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1)
  cognitiveInput.value     = []
  cognitiveCurrentIndex.value = 0
  cognitiveResult.value    = null
  cognitivePhase.value     = 'showing'
  cognitiveShowDigit.value = null
  showNextDigit()
}

function showNextDigit() {
  if (cognitiveCurrentIndex.value >= cognitiveSequence.value.length) {
    cognitiveShowDigit.value = null
    cognitivePhase.value     = 'input'
    return
  }
  cognitiveShowDigit.value = null
  cognitiveTimeout = setTimeout(() => {
    cognitiveShowDigit.value = cognitiveSequence.value[cognitiveCurrentIndex.value]
    cognitiveTimeout = setTimeout(() => {
      cognitiveShowDigit.value = null
      cognitiveCurrentIndex.value++
      cognitiveTimeout = setTimeout(showNextDigit, 400)
    }, 800)
  }, 400)
}

function tapCognitiveDigit(digit: number) {
  if (cognitivePhase.value !== 'input') return
  cognitiveInput.value.push(digit)
  if (cognitiveInput.value.length === cognitiveSequence.value.length) {
    const correct         = cognitiveInput.value.every((d, i) => d === cognitiveSequence.value[i])
    cognitiveResult.value = correct ? 'correct' : 'incorrect'
    cognitivePhase.value  = 'result'
    const entry = { day: daysSinceInjury.value || 1, date: new Date().toISOString().split('T')[0], length: cognitiveSequence.value.length, correct }
    cognitiveHistory.value.push(entry)
    localStorage.setItem('concovery_cognitive', JSON.stringify(cognitiveHistory.value))
  }
}

function deleteCognitiveInput() { cognitiveInput.value.pop() }
function resetCognitive() {
  cognitivePhase.value     = 'idle'
  cognitiveSequence.value  = []
  cognitiveInput.value     = []
  cognitiveResult.value    = null
  cognitiveShowDigit.value = null
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 9 — REACTION TIME TEST
// Five rounds. A green circle appears after a random delay between 1.5 and 3.5 seconds.
// Saved to localStorage under 'concovery_reaction'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const reactionPhase     = ref<'idle' | 'waiting' | 'ready' | 'result'>('idle')
const reactionTimes     = ref<number[]>([])
const reactionStartTime = ref(0)
const reactionResult    = ref(0)
const reactionRound     = ref(0)
let reactionTimeout: ReturnType<typeof setTimeout> | null = null

function startReactionTest() {
  reactionPhase.value = 'waiting'
  reactionTimes.value = []
  reactionRound.value = 1
  scheduleReaction()
}
function scheduleReaction() {
  const delay = 1500 + Math.random() * 2000
  reactionTimeout = setTimeout(() => {
    reactionPhase.value     = 'ready'
    reactionStartTime.value = Date.now()
  }, delay)
}
function tapReaction() {
  if (reactionPhase.value === 'waiting') {
    if (reactionTimeout) clearTimeout(reactionTimeout)
    scheduleReaction()
    return
  }
  if (reactionPhase.value === 'ready') {
    const time = Date.now() - reactionStartTime.value
    reactionTimes.value.push(time)
    if (reactionRound.value < 5) {
      reactionRound.value++
      reactionPhase.value = 'waiting'
      scheduleReaction()
    } else {
      reactionResult.value = Math.round(reactionTimes.value.reduce((a, b) => a + b, 0) / reactionTimes.value.length)
      reactionPhase.value  = 'result'
      const saved = JSON.parse(localStorage.getItem('concovery_reaction') || '[]')
      saved.push({ day: daysSinceInjury.value, avg: reactionResult.value, date: new Date().toISOString() })
      localStorage.setItem('concovery_reaction', JSON.stringify(saved))
    }
  }
}
function resetReaction() { reactionPhase.value = 'idle'; reactionTimes.value = []; reactionRound.value = 0 }
function getReactionLabel(ms: number) {
  if (ms < 250) return { label: 'Excellent, brain speed is fully recovered',     color: '#1B7C3D' }
  if (ms < 350) return { label: 'Good, cognitive recovery is progressing well',  color: '#1A4FAB' }
  if (ms < 450) return { label: 'Fair, keep following the recovery protocol',    color: '#E65100' }
  return             { label: 'Still slow, your brain is still recovering. Do not rush your return', color: '#C62828' }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 10 — RECOVERY JOURNAL
// A daily free-text entry saved to localStorage under 'concovery_journal'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const journalEntry       = ref('')
const journalEntries     = ref<{ day: number; date: string; text: string }[]>([])
const journalSaved       = ref(false)
const showJournalHistory = ref(false)

const todayJournalEntry = computed(() => {
  const todayStr = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  return journalEntries.value.find(e => e.date === todayStr)
})

function saveJournalEntry() {
  if (!journalEntry.value.trim()) return
  const entry = {
    day:  daysSinceInjury.value || 1,
    date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
    text: journalEntry.value.trim(),
  }
  const existing = journalEntries.value.findIndex(e => e.date === entry.date)
  if (existing >= 0) journalEntries.value[existing] = entry
  else               journalEntries.value.push(entry)
  localStorage.setItem('concovery_journal', JSON.stringify(journalEntries.value))
  journalSaved.value = true
  setTimeout(() => { journalSaved.value = false }, 2000)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 11 — EXPANDABLE STAGE TIMELINE (bottom of page)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const expandedStage = ref<number | null>(null)

function toggleStage(stageId: number) {
  expandedStage.value = expandedStage.value === stageId ? null : stageId
}
function getDaysForStage(stageId: number) {
  return Object.entries(dayData)
    .filter(([, d]) => d.stage === stageId)
    .map(([day, d]) => ({ day: parseInt(day), ...d }))
}
function jumpToDay(day: number) {
  selectedDay.value = day
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 12 — LIFECYCLE HOOKS
// onMounted: restore saved data and check if coming back from the exercise page
// onUnmounted: clear all timers so nothing keeps running in the background
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

onMounted(() => {
  const savedDate = localStorage.getItem('concovery_injury_date')
  if (savedDate) { injuryDate.value = savedDate; calculateDays(savedDate) }

  const savedActivities = localStorage.getItem('concovery_activities')
  if (savedActivities) checkedActivities.value = JSON.parse(savedActivities)

  const savedSleep = localStorage.getItem('concovery_sleep')
  if (savedSleep) {
    sleepHistory.value = JSON.parse(savedSleep)
    const todayStr     = new Date().toISOString().split('T')[0]
    const todaySleep   = sleepHistory.value.find(s => s.date === todayStr)
    if (todaySleep) { sleepQuality.value = todaySleep.quality as any; sleepSubmitted.value = true }
  }

  const savedJournal = localStorage.getItem('concovery_journal')
  if (savedJournal) journalEntries.value = JSON.parse(savedJournal)

  const savedCognitive = localStorage.getItem('concovery_cognitive')
  if (savedCognitive) cognitiveHistory.value = JSON.parse(savedCognitive)

  // If the user is returning from the exercise page, reopen the modal at the journal step
  const returnFlag = localStorage.getItem('concovery_return_modal')
  if (returnFlag === 'true') {
    localStorage.removeItem('concovery_return_modal')
    showCheckInModal.value = true
    checkInStep.value = currentStage.value && currentStage.value >= 2 ? 4 : 3
  }
})

onUnmounted(() => {
  if (breathingInterval) clearInterval(breathingInterval)
  if (reactionTimeout)   clearTimeout(reactionTimeout)
  if (cognitiveTimeout)  clearTimeout(cognitiveTimeout)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 13 — COMPUTED PROPERTIES
// These update automatically whenever the values they depend on change.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const currentStage = computed(() => {
  if (!daysSinceInjury.value) return null
  const d = daysSinceInjury.value
  if (d <= 3)  return 1
  if (d <= 6)  return 2
  if (d <= 9)  return 3
  if (d <= 14) return 4
  if (d <= 20) return 5
  return 6
})

// Which day to show in the brain status section.
// If the user clicked a day on the timeline, show that day.
// Otherwise show their actual current day.
const viewingDay = computed(() => {
  if (selectedDay.value !== null) return selectedDay.value
  if (daysSinceInjury.value)      return Math.min(daysSinceInjury.value, 21)
  return null
})

const viewingDayData = computed(() => {
  if (!viewingDay.value) return null
  return dayData[viewingDay.value]
})

// True when the user is looking at their actual current day, not a preview
const isViewingToday = computed(() => {
  if (!daysSinceInjury.value || selectedDay.value === null) return true
  return selectedDay.value === Math.min(daysSinceInjury.value, 21)
})

const daysUntilReturn = computed(() => {
  if (!daysSinceInjury.value) return null
  return Math.max(0, 21 - daysSinceInjury.value)
})

const hasSymptoms = computed(() => symptomAnswers.value.some(a => a === true))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 14 — CORE METHODS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calculateDays(dateStr: string) {
  const injury   = new Date(dateStr)
  const now      = new Date()
  const diffDays = Math.ceil(Math.abs(now.getTime() - injury.getTime()) / (1000 * 60 * 60 * 24))
  daysSinceInjury.value    = diffDays
  selectedDay.value        = null
  symptomStep.value        = 0
  symptomAnswers.value     = [null, null, null]
  showSymptomSection.value = false
  localStorage.setItem('concovery_injury_date', dateStr)
}

watch(injuryDate, (val) => { if (val) calculateDays(val) })

function getDayStatus(day: number): 'past' | 'today' | 'future' {
  if (!daysSinceInjury.value) return 'future'
  if (day < daysSinceInjury.value)                 return 'past'
  if (day === Math.min(daysSinceInjury.value, 21)) return 'today'
  return 'future'
}

function getStageStatus(stageId: number): 'complete' | 'current' | 'upcoming' {
  if (!currentStage.value)            return 'upcoming'
  if (stageId < currentStage.value)   return 'complete'
  if (stageId === currentStage.value) return 'current'
  return 'upcoming'
}
</script>

<template>
  <div class="bg-white min-h-screen">

    <!-- ══ HERO ══════════════════════════════════════════════════════════════ -->
    <section style="background:#0A1628;" class="text-white">
      <div class="max-w-[1200px] mx-auto px-10 py-20">
        <div class="inline-flex items-center border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span class="text-white/50 text-xs font-medium tracking-widest uppercase">Your Recovery Journey</span>
        </div>
        <BlurReveal :delay="0.2" :duration="0.75">
        <h1 class="font-black text-white leading-none mb-6" style="font-size:clamp(40px,8vw,96px);letter-spacing:-0.03em;">
          Let's find out<br>where you are.
        </h1>
        <p class="text-white/60 text-xl font-light max-w-lg leading-relaxed">
          Tell us when it happened and we will guide you through every day of your recovery.
        </p>
        </BlurReveal>
      </div>
    </section>

    <!-- ══ DATE INPUT ════════════════════════════════════════════════════════ -->
    <section class="bg-white py-28">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-[#1A1A1A] mb-8">When did you get your concussion?</h2>

          <div class="relative inline-block mb-10">
            <button @click="showCalendar = !showCalendar" class="inline-flex items-center gap-3 border-2 border-[#1A4FAB] rounded-xl px-6 py-4 bg-white hover:bg-[#F5F8FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="text-xl font-semibold text-[#1A1A1A]">{{ injuryDate ? formatDisplayDate(injuryDate) : 'Select a date' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div v-if="showCalendar" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] p-4 z-50 w-80">
              <div class="flex items-center justify-between mb-4">
                <button @click="prevMonth" class="p-2 hover:bg-[#F5F8FF] rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span class="font-bold text-[#1A1A1A]">{{ monthNames[calendarMonth] }} {{ calendarYear }}</span>
                <button @click="nextMonth" :disabled="isNextMonthDisabled" class="p-2 hover:bg-[#F5F8FF] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
              <div class="grid grid-cols-7 mb-2">
                <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="text-center text-xs font-semibold text-[#5A7A9B] py-1">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-1">
                <div v-for="blank in calendarStartDay" :key="'b'+blank" />
                <button
                  v-for="day in calendarDaysInMonth" :key="day"
                  @click="selectCalendarDate(day)"
                  :disabled="isFutureDay(day)"
                  class="aspect-square rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  :class="isSelectedCalDay(day) ? 'bg-[#1A4FAB] text-white shadow-md' : isToday(day) ? 'border-2 border-[#1A4FAB] text-[#1A4FAB]' : 'hover:bg-[#F5F8FF] text-[#1A1A1A]'"
                >{{ day }}</button>
              </div>
            </div>
          </div>

          <Transition name="fade-scale">
            <div v-if="daysSinceInjury !== null" class="bg-white rounded-2xl border border-[#EBEBEB] shadow-lg p-8">
              <div class="text-6xl font-black text-[#1A4FAB] mb-2" style="letter-spacing:-0.03em;">You are on Day {{ daysSinceInjury }}</div>
              <p class="text-lg text-[#5A7A9B] mb-6">of your 21-day recovery</p>

              <div class="mb-6">
                <div class="flex justify-between text-sm text-[#5A7A9B] mb-3 px-1">
                  <span>Day 1</span><span>Day 7</span><span>Day 14</span><span>Day 21</span>
                </div>
                <div class="flex gap-0.5 justify-between mb-3">
                  <button
                    v-for="day in 21" :key="day"
                    @click="selectedDay = day"
                    class="flex-1 flex flex-col items-center gap-1 group"
                    :title="`Day ${day}, ${dayData[day]?.stageName}`"
                  >
                    <div
                      class="w-full rounded-full transition-all duration-200"
                      :style="{
                        height: selectedDay === day ? '12px' : '6px',
                        background: getDayStatus(day) === 'past' ? '#1B7C3D' : getDayStatus(day) === 'today' ? '#1A4FAB' : '#EBEBEB',
                        outline: selectedDay === day ? '2px solid #1A4FAB' : 'none',
                        outlineOffset: '2px'
                      }"
                    />
                    <span
                      class="text-sm font-bold transition-all"
                      :class="selectedDay === day || getDayStatus(day) === 'today' ? 'text-[#1A4FAB]' : 'text-transparent group-hover:text-[#5A7A9B]'"
                    >{{ day }}</span>
                  </button>
                </div>
                <div class="flex gap-4 justify-center">
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#1B7C3D]"/><span class="text-sm text-[#5A7A9B]">Past</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#1A4FAB]"/><span class="text-sm text-[#5A7A9B]">Today</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#EBEBEB]"/><span class="text-sm text-[#5A7A9B]">Upcoming</span></div>
                </div>
              </div>

              <p v-if="daysUntilReturn && daysUntilReturn > 0" class="text-[#5A7A9B] mb-4 text-sm">{{ daysUntilReturn }} days until you can return to play</p>
              <p v-else-if="daysUntilReturn === 0" class="text-[#1B7C3D] font-semibold mb-4 text-sm">You have reached Day 21. Get medical clearance before returning.</p>
              <span v-if="currentStage" class="inline-block bg-[#1A4FAB] text-white text-base font-semibold px-5 py-2 rounded-full">
                Stage {{ currentStage }}, {{ stages[currentStage - 1].name }}
              </span>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ══ BRAIN STATUS + ACTIVITIES ════════════════════════════════════════ -->
    <section v-if="viewingDay && viewingDayData" class="bg-[#F7F9FC] py-28">
      <div class="max-w-[1200px] mx-auto px-10">

        <div v-if="!isViewingToday" class="bg-[#1A4FAB]/10 border border-[#1A4FAB]/30 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span class="text-[#1A4FAB] text-base font-semibold">Previewing Day {{ viewingDay }}, {{ viewingDayData.stageName }}</span>
            <span class="text-[#5A7A9B] text-xs">(You are on Day {{ daysSinceInjury }})</span>
          </div>
          <button @click="selectedDay = null" class="text-xs text-[#1A4FAB] font-semibold hover:underline">Back to today</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Brain status card -->
          <div class="bg-white rounded-2xl p-10 border border-[#EBEBEB] shadow-sm">
            <span class="inline-block bg-[#1A4FAB]/10 text-[#1A4FAB] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Day {{ viewingDay }}, {{ viewingDayData.stageName }}
            </span>

            <div class="mb-6">
              <div class="flex justify-between text-sm text-[#5A7A9B] mb-1">
                <span>Brain recovery</span>
                <span class="font-bold text-[#1A4FAB]">{{ viewingDayData.brainRecoveryPct }}%</span>
              </div>
              <div class="h-5 bg-[#EBEBEB] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ width: `${viewingDayData.brainRecoveryPct}%`, background: viewingDayData.brainRecoveryPct < 40 ? '#C62828' : viewingDayData.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }"
                />
              </div>
            </div>

            <h3 class="text-base font-bold text-[#1A1A1A] mb-1">Your goal today</h3>
            <p class="text-[#1A4FAB] font-semibold text-sm mb-5">{{ viewingDayData.dailyGoal }}</p>
            <h3 class="text-base font-bold text-[#1A1A1A] mb-2">What is happening in your brain</h3>
            <p class="text-[#1A1A1A] text-base leading-relaxed mb-5">{{ viewingDayData.cellularProcess }}</p>

            <div class="bg-[#C62828]/10 border border-[#C62828] rounded-xl p-5 flex gap-2 mb-4">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-sm text-[#1A1A1A] font-semibold">{{ viewingDayData.warningSign }}</p>
            </div>

            <div class="bg-[#1A4FAB]/5 border border-[#1A4FAB]/20 rounded-xl p-5 flex gap-2">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4FAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p class="text-sm text-[#1A1A1A] italic leading-relaxed">{{ viewingDayData.insight }}</p>
            </div>
            <p class="text-sm text-[#5A7A9B] italic mt-4">Source: Giza and Hovda, 2014. Neurometabolic Cascade. AIS 2024</p>
          </div>

          <!-- Activities card with stagger animation -->
          <div class="bg-white rounded-2xl p-10 border border-[#EBEBEB] shadow-sm">
            <h3 class="text-3xl font-bold text-[#1A1A1A] mb-8">What you can do today</h3>

            <!-- Allowed activities with icons and stagger animation -->
            <div class="mb-8">
              <div class="flex items-center gap-2 text-[#1B7C3D] font-bold text-base mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Allowed Today
              </div>

              <div class="space-y-3" :key="`activities-${viewingDay}`">
                <div
                  v-for="(a, idx) in viewingDayData.allowed"
                  :key="a.activity"
                  class="activity-card flex items-start gap-4 bg-[#F5FFF7] border border-[#1B7C3D]/20 rounded-2xl p-5"
                  :class="isActivityChecked(`${viewingDay}-${a.activity}`) && !a.interactive ? 'opacity-60' : ''"
                  :style="{ animationDelay: `${idx * 90}ms` }"
                >
                  <!-- Activity icon -->
                  <div class="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center" :class="a.interactive ? 'bg-[#1A4FAB]/10' : 'bg-[#1B7C3D]/10'">

                    <!-- Sleep icon -->
                    <svg v-if="getActivityIcon(a.activity) === 'sleep'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>

                    <!-- Breathing icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'breathing'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>

                    <!-- Cognitive icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'cognitive'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>

                    <!-- Reaction icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'reaction'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>

                    <!-- Movement icon (walk/jog/run) -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'movement'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="m7.5 17.5 1-4.5 2.5 2 3-4.5"/><path d="m11 9-1 3h4l-1.5 4"/><path d="m16.5 17.5-1-4.5"/></svg>

                    <!-- Swim icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'swim'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 17c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><circle cx="16.5" cy="6.5" r="1.5"/></svg>

                    <!-- Bike icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'bike'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>

                    <!-- Gym icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'gym'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5v14"/><path d="M18 5v14"/><path d="M2 9h4"/><path d="M18 9h4"/><path d="M2 15h4"/><path d="M18 15h4"/><path d="M6 9h12"/><path d="M6 15h12"/></svg>

                    <!-- Stretch icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'stretch'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/></svg>

                    <!-- Study / school icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'study'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>

                    <!-- Sport / drills icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'sport'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>

                    <!-- Medical icon -->
                    <svg v-else-if="getActivityIcon(a.activity) === 'medical'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

                    <!-- Rest icon (default) -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#1A4FAB' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <!-- Checkbox for non-interactive activities -->
                      <button
                        v-if="!a.interactive"
                        @click="toggleActivity(`${viewingDay}-${a.activity}`)"
                        class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                        :class="isActivityChecked(`${viewingDay}-${a.activity}`) ? 'bg-[#1B7C3D] border-[#1B7C3D]' : 'border-[#1B7C3D]'"
                      >
                        <svg v-if="isActivityChecked(`${viewingDay}-${a.activity}`)" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      </button>
                      <span class="font-semibold text-[#1A1A1A] text-sm" :class="isActivityChecked(`${viewingDay}-${a.activity}`) && !a.interactive ? 'line-through text-[#5A7A9B]' : ''">{{ a.activity }}</span>
                    </div>
                    <p class="text-sm text-[#5A7A9B] leading-relaxed mb-2">{{ a.detail }}</p>

                    <!-- Breathing widget -->
                    <div v-if="a.interactive === 'breathing' && isViewingToday" class="mt-2">
                      <div v-if="!breathingActive && breathingPhase === 'idle'">
                        <button @click="startBreathing" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start breathing exercise</button>
                      </div>
                      <div v-else class="bg-[#F5F8FF] rounded-xl p-6 text-center">
                        <div class="relative w-16 h-16 mx-auto mb-2">
                          <svg class="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" stroke="#EBEBEB" stroke-width="6" fill="none"/>
                            <circle cx="40" cy="40" r="34" stroke="#1A4FAB" stroke-width="6" fill="none" :stroke-dasharray="`${(breathingProgress / 100) * 213.6} 213.6`" class="transition-all duration-1000"/>
                          </svg>
                          <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-sm font-bold text-[#1A4FAB] uppercase">{{ breathingPhase }}</span>
                            <span class="text-base font-black text-[#1A1A1A]">{{ breathingCount }}</span>
                          </div>
                        </div>
                        <p class="text-sm text-[#5A7A9B] mb-2">Cycle {{ breathingCycles + 1 }} of 3</p>
                        <button @click="stopBreathing" class="text-xs text-[#C62828] hover:underline">Stop</button>
                      </div>
                    </div>

                    <!-- Cognitive widget -->
                    <div v-if="a.interactive === 'cognitive' && isViewingToday" class="mt-2">
                      <div v-if="cognitivePhase === 'idle'">
                        <button @click="startCognitiveTest" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start digit span test</button>
                        <span v-if="cognitiveHistory.length > 0" class="text-sm text-[#5A7A9B] ml-2">
                          Last: {{ cognitiveHistory[cognitiveHistory.length - 1].correct ? 'Correct' : 'Incorrect' }}, {{ cognitiveHistory[cognitiveHistory.length - 1].length }} digits
                        </span>
                      </div>
                      <div v-else-if="cognitivePhase === 'showing'" class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-xl p-6 text-center">
                        <p class="text-sm text-[#5A7A9B] mb-3">Watch the digits carefully</p>
                        <div class="h-16 flex items-center justify-center">
                          <Transition name="fade-scale" mode="out-in">
                            <span v-if="cognitiveShowDigit !== null" :key="cognitiveShowDigit" class="text-5xl font-black text-[#1A4FAB]">{{ cognitiveShowDigit }}</span>
                            <span v-else class="text-5xl font-black text-[#EBEBEB]">?</span>
                          </Transition>
                        </div>
                        <p class="text-sm text-[#5A7A9B] mt-2">{{ cognitiveCurrentIndex }} of {{ cognitiveSequence.length }} shown</p>
                      </div>
                      <div v-else-if="cognitivePhase === 'input'" class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-xl p-6">
                        <p class="text-sm text-[#5A7A9B] mb-3 text-center">Enter the digits in order</p>
                        <div class="flex gap-1 justify-center mb-3 min-h-[36px] flex-wrap">
                          <div v-for="(digit, i) in cognitiveInput" :key="i" class="w-8 h-8 bg-[#1A4FAB] text-white rounded-lg flex items-center justify-center font-bold text-sm">{{ digit }}</div>
                          <div v-for="i in (cognitiveSequence.length - cognitiveInput.length)" :key="'e'+i" class="w-8 h-8 bg-white border-2 border-[#EBEBEB] rounded-lg"/>
                        </div>
                        <div class="grid grid-cols-3 gap-1 mb-2">
                          <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="tapCognitiveDigit(n)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#1A4FAB] hover:text-white transition-colors">{{ n }}</button>
                        </div>
                        <div class="grid grid-cols-3 gap-1">
                          <button @click="deleteCognitiveInput" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#C62828] hover:bg-[#FFF5F5] transition-colors">Del</button>
                          <button @click="tapCognitiveDigit(0)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#1A4FAB] hover:text-white transition-colors">0</button>
                          <div/>
                        </div>
                      </div>
                      <div v-else-if="cognitivePhase === 'result'" class="rounded-xl p-6 text-center" :class="cognitiveResult === 'correct' ? 'bg-[#1B7C3D]/10 border border-[#1B7C3D]' : 'bg-[#C62828]/10 border border-[#C62828]'">
                        <p class="font-bold text-sm mb-1" :class="cognitiveResult === 'correct' ? 'text-[#1B7C3D]' : 'text-[#C62828]'">{{ cognitiveResult === 'correct' ? 'Correct sequence' : 'Incorrect sequence' }}</p>
                        <p class="text-sm text-[#5A7A9B] mb-1">Sequence: {{ cognitiveSequence.join(', ') }}</p>
                        <p class="text-sm text-[#5A7A9B] mb-3">Your input: {{ cognitiveInput.join(', ') }}</p>
                        <button @click="resetCognitive" class="text-xs text-[#1A4FAB] hover:underline">Try again</button>
                      </div>
                    </div>

                    <!-- Reaction time widget -->
                    <div v-if="a.interactive === 'reaction' && isViewingToday" class="mt-2">
                      <div v-if="reactionPhase === 'idle'">
                        <button @click="startReactionTest" class="text-xs bg-[#1A4FAB] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start reaction test</button>
                      </div>
                      <div v-else-if="reactionPhase === 'waiting'" @click="tapReaction" class="bg-[#F5F8FF] border-2 border-[#1A4FAB] rounded-xl p-5 text-center cursor-pointer hover:bg-[#EEF3FF] transition-colors">
                        <p class="text-xs font-semibold text-[#1A1A1A] mb-1">Round {{ reactionRound }} of 5</p>
                        <p class="text-sm text-[#5A7A9B]">Wait for the green circle...</p>
                        <div class="w-10 h-10 rounded-full bg-[#EBEBEB] mx-auto mt-2"/>
                      </div>
                      <div v-else-if="reactionPhase === 'ready'" @click="tapReaction" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-xl p-5 text-center cursor-pointer hover:bg-[#1B7C3D]/20 transition-colors">
                        <p class="text-xs font-semibold text-[#1A1A1A] mb-2">Tap now</p>
                        <div class="w-10 h-10 rounded-full bg-[#1B7C3D] mx-auto animate-pulse"/>
                      </div>
                      <div v-else-if="reactionPhase === 'result'" class="bg-[#F5F8FF] rounded-xl p-5 text-center">
                        <p class="text-base font-black text-[#1A4FAB]">{{ reactionResult }}ms</p>
                        <p class="text-xs font-semibold mb-2" :style="{ color: getReactionLabel(reactionResult).color }">{{ getReactionLabel(reactionResult).label }}</p>
                        <button @click="resetReaction" class="text-sm text-[#5A7A9B] hover:underline">Test again</button>
                      </div>
                    </div>

                    <!-- Note for interactive items when previewing a future day -->
                    <div v-if="a.interactive && !isViewingToday" class="mt-2">
                      <span class="text-sm text-[#5A7A9B] italic">Available when you reach Day {{ viewingDay }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Restricted activities as compact pills -->
            <div class="mb-6">
              <div class="flex items-center gap-2 text-[#C62828] font-bold text-base mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Not Today
              </div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="r in viewingDayData.restricted" :key="r"
                  class="inline-flex items-center gap-2 bg-[#FFF5F5] border border-[#C62828]/20 rounded-full px-4 py-2"
                >
                  <span class="text-[#C62828] font-bold text-sm flex-shrink-0">✗</span>
                  <span class="text-[#1A1A1A] text-sm">{{ r }}</span>
                </div>
              </div>
            </div>

            <div class="bg-[#E65100]/10 border border-[#E65100] rounded-xl p-6 flex gap-3">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E65100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-sm text-[#1A1A1A] font-semibold">If any symptoms come back, stop immediately and return to Stage 1</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CHECK-IN BUTTON ════════════════════════════════════════════════════ -->
    <section v-if="daysSinceInjury && isViewingToday" class="bg-white py-16">
      <div class="max-w-[1200px] mx-auto px-10 text-center">
        <div class="bg-[#F5F8FF] border border-[#1A4FAB]/20 rounded-2xl p-8 max-w-xl mx-auto">
          <h2 class="text-xl font-bold text-[#1A1A1A] mb-2">Complete today's check-in</h2>
          <p class="text-[#5A7A9B] text-sm mb-6">
            Takes about 3 minutes. Track your sleep, symptoms{{ currentStage && currentStage >= 2 ? ', exercises' : '' }} and how you feel today.
          </p>
          <div class="flex gap-2 justify-center mb-6">
            <div v-for="i in totalCheckInSteps" :key="i" class="w-2 h-2 rounded-full bg-[#EBEBEB]" />
          </div>
          <button
            @click="openCheckIn"
            class="bg-[#1A4FAB] text-white px-10 py-5 rounded-full font-semibold text-base hover:bg-[#1440A0] transition-colors flex items-center gap-3 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Start today's check-in
          </button>
        </div>
      </div>
    </section>

    <!-- ══ CHECK-IN MODAL ═════════════════════════════════════════════════════ -->
    <Transition name="modal">
      <div
        v-if="showCheckInModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(10,22,40,0.85); backdrop-filter: blur(4px);"
      >
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

          <div class="px-10 pt-10 pb-8 border-b border-[#EBEBEB]">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-semibold text-[#5A7A9B] uppercase tracking-widest">
                Step {{ checkInStep }} of {{ totalCheckInSteps }}
              </span>
              <button @click="closeCheckIn" class="w-8 h-8 rounded-full bg-[#F7F9FC] flex items-center justify-center hover:bg-[#EBEBEB] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A7A9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div class="h-1.5 bg-[#EBEBEB] rounded-full overflow-hidden">
              <div
                class="h-full bg-[#1A4FAB] rounded-full transition-all duration-500"
                :style="{ width: `${(checkInStep / totalCheckInSteps) * 100}%` }"
              />
            </div>
          </div>

          <div class="px-10 py-10 min-h-[440px]">
            <Transition name="slide-up" mode="out-in">

              <!-- STEP 1: Sleep -->
              <div v-if="checkInStep === 1" key="sleep">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Sleep</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">How did you sleep last night?</h3>
                <p class="text-[#5A7A9B] text-base mb-10">Sleep quality is one of the strongest predictors of how quickly you will recover.</p>

                <div v-if="!sleepSubmitted" class="flex flex-col gap-3">
                  <button @click="submitSleep('well'); nextCheckInStep()" class="w-full py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#1B7C3D] text-[#1B7C3D] hover:bg-[#1B7C3D] hover:text-white">Well, slept through the night</button>
                  <button @click="submitSleep('okay'); nextCheckInStep()" class="w-full py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#E65100] text-[#E65100] hover:bg-[#E65100] hover:text-white">Okay, a few disruptions</button>
                  <button @click="submitSleep('poorly'); nextCheckInStep()" class="w-full py-4 rounded-xl border-2 font-semibold text-sm transition-all border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white">Poorly, struggled to sleep</button>
                </div>

                <div v-else>
                  <div class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-xl p-6 flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 rounded-full" :style="{ background: sleepQuality === 'well' ? '#1B7C3D' : sleepQuality === 'okay' ? '#E65100' : '#C62828' }"/>
                      <span class="text-base font-semibold text-[#1A1A1A] capitalize">Slept {{ sleepQuality }} last night</span>
                    </div>
                    <button @click="sleepSubmitted = false; sleepQuality = null" class="text-sm text-[#5A7A9B] hover:underline">Change</button>
                  </div>
                  <div v-if="consecutivePoorSleep" class="bg-[#C62828]/10 border border-[#C62828] rounded-xl p-6 flex gap-3 mb-6">
                    <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p class="text-sm text-[#1A1A1A] font-semibold">Three nights of poor sleep in a row. Please mention this to your GP at your next appointment.</p>
                  </div>
                  <button @click="nextCheckInStep" class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Continue</button>
                </div>
              </div>

              <!-- STEP 2: Symptoms -->
              <div v-else-if="checkInStep === 2" key="symptoms">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Symptoms</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">How are you feeling today?</h3>
                <p class="text-[#5A7A9B] text-base mb-10">Be honest with yourself. This affects your recovery timeline.</p>

                <div v-if="symptomStep === 0" class="text-center">
                  <button @click="startSymptomCheck" class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Start symptom check</button>
                </div>

                <div v-else-if="symptomStep >= 1 && symptomStep <= 3">
                  <div class="text-sm font-semibold text-[#5A7A9B] uppercase tracking-widest mb-4 text-center">Question {{ symptomStep }} of 3</div>
                  <Transition name="slide-up" mode="out-in">
                    <div :key="symptomStep" class="text-center">
                      <div class="bg-[#F7F9FC] border-2 border-[#EBEBEB] rounded-2xl p-8 mb-6">
                        <h3 class="text-xl font-bold text-[#1A1A1A] mb-6">{{ symptomQuestions[symptomStep - 1] }}</h3>
                        <div class="flex gap-4 justify-center">
                          <button @click="answerSymptom(false)" class="flex-1 max-w-[130px] py-4 rounded-full font-bold border-2 border-[#1B7C3D] text-[#1B7C3D] hover:bg-[#1B7C3D] hover:text-white transition-all">No</button>
                          <button @click="answerSymptom(true)" class="flex-1 max-w-[130px] py-4 rounded-full font-bold border-2 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white transition-all">Yes</button>
                        </div>
                      </div>
                      <div class="flex justify-center gap-2">
                        <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full transition-all" :class="i <= symptomStep ? 'bg-[#1A4FAB]' : 'bg-[#EBEBEB]'" />
                      </div>
                    </div>
                  </Transition>
                </div>

                <div v-else-if="symptomStep === 4">
                  <div v-if="!hasSymptoms" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-2xl p-8 text-center mb-6">
                    <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <p class="text-lg font-bold text-[#1A1A1A] mb-1">You are clear for today.</p>
                    <p class="text-[#5A7A9B] text-sm">Continue with your Stage {{ currentStage }} activities as planned.</p>
                  </div>
                  <div v-else class="bg-[#C62828]/10 border-2 border-[#C62828] rounded-2xl p-8 text-center mb-6">
                    <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p class="text-lg font-bold text-[#1A1A1A] mb-1">Stop all activity today.</p>
                    <p class="text-[#5A7A9B] text-sm mb-4">See a GP or sports doctor before you continue.</p>
                    <router-link to="/locatesupport" @click="closeCheckIn">
                      <button class="bg-[#C62828] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#B71C1C] transition-colors flex items-center gap-2 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        Find a clinic near me
                      </button>
                    </router-link>
                  </div>
                  <button @click="nextCheckInStep" class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors">Continue</button>
                </div>
              </div>

              <!-- STEP 3: Neck Exercises (Stage 2 and above only) -->
              <div v-else-if="checkInStep === 3 && currentStage && currentStage >= 2" key="exercises">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Neck Exercises</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">Time for your neck exercises</h3>
                <p class="text-[#5A7A9B] text-sm mb-6">
                  You will be taken to a guided exercise page with optional camera support.
                  When you finish, you will come straight back here to write your journal entry.
                </p>

                <div class="space-y-3 mb-6">
                  <div
                    v-for="(def, idx) in exerciseDefinitions" :key="idx"
                    class="border rounded-xl p-6 flex items-center justify-between border-[#EBEBEB] bg-white"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-[#1A4FAB]/10 flex items-center justify-center flex-shrink-0">
                        <span class="text-sm font-bold text-[#1A4FAB]">{{ idx + 1 }}</span>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-[#1A1A1A]">{{ def.name }}</p>
                        <p class="text-sm text-[#5A7A9B]">{{ def.sets }} sets, {{ def.reps }} reps</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  @click="goToExercises"
                  class="w-full bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  Start neck exercises
                </button>

                <button @click="nextCheckInStep" class="w-full py-3 rounded-full text-base font-semibold text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors">
                  Skip for now
                </button>
              </div>

              <!-- STEP 4 (or Step 3 on Stage 1): Journal -->
              <div v-else key="journal">
                <div class="text-[#1A4FAB] text-xs font-semibold tracking-widest uppercase mb-2">Recovery Journal</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">Write about your day</h3>
                <p class="text-[#5A7A9B] text-sm mb-6">One sentence is enough. Saved privately on this device only.</p>

                <div class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-xl p-6 mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-base font-semibold text-[#1A4FAB]">Day {{ daysSinceInjury }}</span>
                    <span class="text-sm text-[#5A7A9B]">{{ new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long' }) }}</span>
                  </div>
                  <textarea
                    v-model="journalEntry"
                    placeholder="How are you feeling? Any symptoms? What did you manage to do today?"
                    rows="3"
                    class="w-full text-sm text-[#1A1A1A] bg-transparent resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                <div class="flex gap-3">
                  <button
                    @click="saveJournalEntry(); closeCheckIn()"
                    :disabled="!journalEntry.trim()"
                    class="flex-1 bg-[#1A4FAB] text-white py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >{{ journalSaved ? 'Saved!' : 'Save and finish' }}</button>
                  <button @click="closeCheckIn" class="px-6 py-4 rounded-full text-base font-semibold text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors">Skip</button>
                </div>
              </div>

            </Transition>
          </div>

          <div v-if="checkInStep > 1" class="px-10 pb-10">
            <button @click="prevCheckInStep" class="text-sm text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ 6 STAGE TIMELINE ════════════════════════════════════════════════════ -->
    <section v-if="daysSinceInjury && currentStage" class="bg-white py-28">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-[#1A1A1A] mb-4">Your full recovery journey</h2>
          <p class="text-[#5A7A9B]">Australian Institute of Sport 2024 mandatory protocol. Click any stage to explore the days inside it.</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="stage in stages" :key="stage.id"
            class="rounded-2xl border-2 overflow-hidden transition-all duration-300"
            :class="{ 'border-[#1A4FAB]': getStageStatus(stage.id) === 'current', 'border-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'border-[#EBEBEB]': getStageStatus(stage.id) === 'upcoming' }"
          >
            <button
              @click="toggleStage(stage.id)"
              class="w-full flex items-center justify-between p-7 transition-colors text-left"
              :class="{ 'bg-[#1A4FAB] text-white': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]/10 text-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#F7F9FC] text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="{ 'bg-white/20': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#EBEBEB]': getStageStatus(stage.id) === 'upcoming' }"
                >
                  <svg v-if="getStageStatus(stage.id) === 'complete'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else class="text-sm font-black" :class="{ 'text-white': getStageStatus(stage.id) === 'current', 'text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }">{{ stage.id }}</span>
                </div>
                <div>
                  <div class="font-bold text-base">{{ stage.name }}</div>
                  <div class="text-sm opacity-70 mt-1">Days {{ stage.days }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-bold px-3 py-1 rounded-full"
                  :class="{ 'bg-white/20 text-white': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D] text-white': getStageStatus(stage.id) === 'complete', 'bg-[#5A7A9B]/20 text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }"
                >{{ getStageStatus(stage.id).toUpperCase() }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200" :class="expandedStage === stage.id ? 'rotate-180' : ''"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </button>

            <Transition name="slide-up">
              <div v-if="expandedStage === stage.id" class="border-t border-[#EBEBEB]">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                  <button
                    v-for="dayEntry in getDaysForStage(stage.id)" :key="dayEntry.day"
                    @click="jumpToDay(dayEntry.day)"
                    class="text-left bg-white border rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    :class="dayEntry.day === daysSinceInjury ? 'border-[#1A4FAB] bg-[#F5F8FF]' : 'border-[#EBEBEB]'"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-bold text-[#1A4FAB]">Day {{ dayEntry.day }}</span>
                      <span
                        class="text-sm font-bold px-2 py-0.5 rounded-full"
                        :class="dayEntry.day < (daysSinceInjury || 0) ? 'bg-[#1B7C3D]/10 text-[#1B7C3D]' : dayEntry.day === daysSinceInjury ? 'bg-[#1A4FAB] text-white' : 'bg-[#EBEBEB] text-[#5A7A9B]'"
                      >{{ dayEntry.day < (daysSinceInjury || 0) ? 'Done' : dayEntry.day === daysSinceInjury ? 'Today' : 'Upcoming' }}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="h-1.5 flex-1 bg-[#EBEBEB] rounded-full overflow-hidden">
                        <div class="h-full rounded-full" :style="{ width: `${dayEntry.brainRecoveryPct}%`, background: dayEntry.brainRecoveryPct < 40 ? '#C62828' : dayEntry.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }"/>
                      </div>
                      <span class="text-sm font-bold text-[#5A7A9B]">{{ dayEntry.brainRecoveryPct }}%</span>
                    </div>
                    <p class="text-sm text-[#5A7A9B] leading-relaxed line-clamp-2">{{ dayEntry.dailyGoal }}</p>
                    <p class="text-xs text-[#1A4FAB] font-semibold mt-2">View this day</p>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SUPPORT CTA ════════════════════════════════════════════════════════ -->
    <section style="background:#0A1628;" class="py-20 text-center">
      <div class="max-w-[1200px] mx-auto px-10">
        <h2 class="text-3xl font-bold text-white mb-4">Not sure if you are ready?</h2>
        <p class="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">Find the nearest GP, sports medicine clinic or hospital for a professional assessment.</p>
        <router-link to="/locatesupport">
          <button class="bg-[#1A4FAB] text-white px-10 py-5 rounded-full font-semibold hover:bg-[#1440A0] transition-colors flex items-center gap-2 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Find a clinic near me
          </button>
        </router-link>
        <p class="text-white/30 text-sm">Medical clearance is required before returning to full contact sport</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Activity cards slide in from below with a stagger */
.activity-card {
  opacity: 0;
  animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Page transitions */
.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.97); }

.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-16px); }

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }
</style>
