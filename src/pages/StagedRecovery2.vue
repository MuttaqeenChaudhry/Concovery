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

const stages: Stage[] = [
  { id: 1, name: 'Complete Rest',           shortName: 'Rest',           days: '1-3'   },
  { id: 2, name: 'Light Aerobic',           shortName: 'Light Aerobic',  days: '4-6'   },
  { id: 3, name: 'Sport Specific Exercise', shortName: 'Sport Specific', days: '7-9'   },
  { id: 4, name: 'Non-Contact Training',    shortName: 'Non-Contact',    days: '10-14' },
  { id: 5, name: 'Full Contact',            shortName: 'Full Contact',   days: '15-20' },
  { id: 6, name: 'Return to Play',          shortName: 'Return to Play', days: '21+'   },
]

const exerciseDefinitions = [
  { name: 'Chin Tucks',      sets: 3, reps: 10 },
  { name: 'Neck Rotations',  sets: 1, reps: 10 },
  { name: 'Neck Isometrics', sets: 3, reps: 8  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 21-DAY DATA
// Source: Giza and Hovda 2014 (Neurometabolic Cascade), AIS 2024 Return to Play Protocol
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const dayData: Record<number, {
  stage: number; stageName: string; brainRecoveryPct: number
  cellularProcess: string; descriptionSimple: string; dailyGoal: string
  allowed: { activity: string; detail: string; interactive?: string }[]
  restricted: string[]; warningSign: string; insight: string
}> = {
  1: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 5,
    cellularProcess: 'When concussion occurs, the brain experience chemical disruption which makes neurons fire uncontrolably. The potassium floods out, calcium rushes in which make the chemical become imbalance. Your brain then trys to fix this by burning energy supply up to 46% above the normal rate. However at the same time, the blood in brain drops by 50% creating a mismatch. This shows that the brain is deperate for energy but would not be able to get enough of it. The symptoms may not peak until 24 to 48 hours after the injury (Giza & Hovda, 2001; 2014).',
    descriptionSimple: 'Your brain has switched into full repair mode. Your brain pouring all of its energy into stabilising itself. Rest should be your only priority!',
    dailyGoal: 'Do absolutely nothing today. Every resource your brain has needs to go toward stabilising.',
    allowed: [
      { activity: 'Prioritise rest', detail: 'Physical and mental rest are both essential in the first 24 hours.' },
      { activity: 'Sleep as much as possible', detail: 'Sleep is when the brain repairs itself most effectively.' },
      { activity: 'Stay in a quiet, dimly lit environment', detail: 'Reduce strain on your brain by minimising sensory input.' },
      { activity: 'Tell a trusted person your symptoms', detail: 'Make sure someone can monitor you and check in regularly.' },
      { activity: 'See a doctor today', detail: 'See a doctor or healthcare provider as soon as possible.' },
      { activity: 'Guided rest breathing', detail: '4-7-8 breathing lowers your cognitive load and supports neurological recovery.', interactive: 'breathing' },
    ],
    restricted: ['Do not use any screens', 'Do not do any physical activity of any kind', 'Do not expose yourself to loud noises or bright lights', 'Do not attempt to read, study, or do any concentration tasks', 'Do not be left alone'],
    warningSign: 'If your headache gets worse, you vomit, or you lose consciousness, call 000 immediately.',
    insight: 'You might feel like you are doing nothing useful. You are not. Resting on Day 1 is the most active recovery decision you can make.',
  },
  2: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 10,
    cellularProcess: 'The chemical disruption is still ongoing today. Your brain cells are working overtime to restore your internal balance which consume vast amount of energy. Therefore, any mental or physical effort can compete for energy away from the repair process and slow down your recovery. 25% of people experience worst symtoms during 24 to 48 hrs window.',
    descriptionSimple: 'Your brain is still deep in its repair process today, and that is completely fine as healing takes time. Every moment of rest is giving your brain the energy it needs to restore itself. Be kind to yourself today, because resting is genuinely the most productive thing you can do right now.',
    dailyGoal: 'Keep resting. If symptoms seem to be easing, do not be fooled. Your brain is still in crisis.',
    allowed: [
      { activity: 'Continue complete rest', detail: 'Physical and cognitive rest are both essential today.' },
      { activity: 'Limit screen time', detail: 'No more than 65 minutes total today (Concussion Alliance, 2024).' },
      { activity: 'Stay in a calm, quiet environment', detail: 'Avoid any stimulation that could strain your recovering brain.' },
      { activity: 'Drink water and eat light meals', detail: 'Stay hydrated and eat nutritious food to support recovery.' },
      { activity: 'Track your symptoms', detail: 'Note any worsening and report it to your doctor.' },
      { activity: 'Guided rest breathing', detail: 'Breathing exercises lower stress hormones that slow brain recovery.', interactive: 'breathing' },
    ],
    restricted: ['Do not use screens beyond the recommended limit', 'Do not attempt any physical exertion, even light walking', 'Do not put yourself in stressful or emotional situations', 'Do not try to test whether you are getting better by resuming activities', 'Do not consume alcohol'],
    warningSign: 'If symptoms are noticeably worse than yesterday, see a GP today and do not wait.',
    insight: 'Day 2 is when most players want to grab their phone. Do not. Your neurons need the energy that screen time steals.',
  },
  3: {
    stage: 1, stageName: 'Complete Rest', brainRecoveryPct: 15,
    cellularProcess: 'Your brain\'s ability to generate power efficiently is still disrupted by the mitochondria (structure responsible for brain energy) that has calcium that flooded into brain cells at the time of injury. This has forced the brain to rely on a less effective backup energy system. At the same time, magnesium levels (help protect brain cells from damage) drop sharply after a concussion and remain low for up to four days. The combination of these two factors means the brain is at its lowest energy production capacity right now (Giza & Hovda, 2001).',
    descriptionSimple: 'Today is often the hardest day of a concussion recovery, and there is a clear biological reason for that. Your brain\'s energy system is at its lowest point right now. The way you feel is your body responding exactly as it should to the injury. Keep resting, keep hydrated. It will better from here.',
    dailyGoal: 'If you are completely symptom free, you can try very gentle cognitive activity. If any symptoms remain, keep resting.',
    allowed: [
      { activity: 'Prioritise rest above everything', detail: 'Your brain needs maximum energy for repair today.' },
      { activity: 'Sleep as much as possible', detail: 'Sleep is your most powerful recovery tool right now.' },
      { activity: 'Stay in a dark, quiet space', detail: 'Minimise sensory demand on the brain.' },
      { activity: 'Eat nutritious food', detail: 'Support cellular recovery with good nutrition.' },
      { activity: 'Keep tracking symptoms', detail: 'Contact your doctor if anything worsens significantly.' },
      { activity: 'Guided rest breathing', detail: 'Keep up your daily breathing practice.', interactive: 'breathing' },
    ],
    restricted: ['Do not use screens unless absolutely necessary', 'Do not leave the house for anything non-essential', 'Do not do any physical activity', 'Do not engage in stressful conversations or situations', 'Do not rush or pressure yourself to feel better'],
    warningSign: 'Any return of headache, dizziness or brain fog means go straight back to complete rest.',
    insight: 'Being symptom free does not mean your brain has healed. You are at 15% recovery. Stage 2 starts tomorrow.',
  },
  4: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 22,
    cellularProcess: 'Today the calcium overload in your brain begin to gradually clear. However, magnesium levels remain depleted and a waste product called lactate has been building up as there is efficient enrgy production in the brain.',
    descriptionSimple: 'Your brain is still in active repair state. You might start to feel slightly better today, and that is a good sign! What you cannot feel is that important repair work is still happening underneath the surface and that is why protecting yourself even when you feel a little better matters so much. Every hour of rest you give your brain today is going directly toward your recovery.',
    dailyGoal: 'Introduce light aerobic activity that keeps your heart rate below 60% of your maximum.',
    allowed: [
      { activity: 'Continue resting', detail: 'Even if you feel slightly better, rest is still the priority.' },
      { activity: 'Very short gentle walks', detail: 'Around the house only if symptoms allow. Stop if anything returns.' },
      { activity: 'Gradually reintroduce screens', detail: 'No more than 15 to 20 minutes at a time if tolerated.' },
      { activity: 'Eat well and stay hydrated', detail: 'Good nutrition directly supports the brain recovery process.' },
      { activity: 'Continue tracking symptoms', detail: 'Note any improvements or changes and report them.' },
      { activity: 'Guided rest breathing', detail: 'Keep up your daily breathing practice.', interactive: 'breathing' },
      { activity: 'Cognitive load test', detail: 'The daily digit span test tracks how your cognitive speed is recovering.', interactive: 'cognitive' },
    ],
    restricted: ['Do not do any cardio or activity that raises your heart rate', 'Do not return to study or work yet', 'Do not use screens for extended periods', 'Do not do anything that brings your symptoms back or makes them worse', 'Do not expose yourself to contact or collision risk of any kind'],
    warningSign: 'Stop immediately if headache, dizziness or nausea comes back during or after activity.',
    insight: 'Light movement actually helps recovery by increasing blood flow to your brain. The moment symptoms return, stop.',
  },
  5: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 28,
    cellularProcess: 'The most intense phase of the initial chemical disruption has been settled. But, your brain is still in period of reduced energy production which could last up to 2 to 4 weeks. Right now, process called secondary axotomy is still occuring, where nerve fibres that were damaged at impact continue to slowly break down (Giza & Hovda, 2001). Additionally, brain imaging studies have shown this low-energy state exists even in people who are walking, talking, and reporting minimal symptoms. This means that feeling better and being fully recovered are not the same thing.',
    descriptionSimple: 'Feeling better is a real and meaningful sign of progress — but brain scans of people at this exact stage show that important healing is still happening underneath the surface that you simply cannot feel yet.',
    dailyGoal: 'Extend your aerobic activity by about 5 minutes compared to yesterday, if you are still symptom free.',
    allowed: [
      { activity: 'Begin very light cognitive tasks', detail: 'Short conversations and brief reading only if they do not increase symptoms.' },
      { activity: 'Try gentle slow walking', detail: 'Only if symptoms allow. Stop immediately if anything returns.' },
      { activity: 'Gradually return to screens in short bursts', detail: 'Stop immediately if symptoms increase.' },
      { activity: 'Calm social interaction', detail: 'Only if it does not cause fatigue or headaches.' },
      { activity: 'Listen to your body', detail: 'Rest whenever symptoms increase — do not push through.' },
      { activity: 'Cognitive load test', detail: 'Compare your score to yesterday to track how your brain speed is coming back.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'A light cognitive challenge to track how quickly your brain is responding.', interactive: 'reaction' },
    ],
    restricted: ['Do not do any activity that causes your symptoms to worsen', 'Do not attempt sports or any form of high-intensity exercise', 'Do not expose yourself to loud, busy, or overstimulating environments', 'Do not drive if you are experiencing any symptoms at all', 'Do not return to full school or work days yet'],
    warningSign: 'Feeling tired after light activity is normal. A headache is not. Stop if it appears.',
    insight: 'You are at 28% recovery. Do not confuse your symptoms clearing up with your brain being healed. They are different things.',
  },
  6: {
    stage: 2, stageName: 'Light Aerobic', brainRecoveryPct: 34,
    cellularProcess: 'Brain imaging studies of people at this stage of concussion recovery confirm that blood flow and energy use inside the brain are still disrupted, even in those who report feeling much better. The slow breakdown of nerve fibres damaged at impact is still ongoing. The improvement in symptoms reflects the brain stabilising from the acute chemical crisis (First Week After Concussion, 2017).',
    descriptionSimple: 'Your brain is continuing its repair work. Keep going every good choice you make today is building the foundation for full recovery.',
    dailyGoal: 'This is your last day of Stage 2. Prepare to introduce sport specific movement tomorrow.',
    allowed: [
      { activity: 'Gradually increase daily activity', detail: 'Only if symptoms remain stable throughout.' },
      { activity: 'Try a short walk', detail: 'If you feel ready. Stop immediately if any symptoms return.' },
      { activity: 'Part-time return to school or work', detail: 'Only if symptoms allow. Do not push to full days yet.' },
      { activity: 'Maintain a consistent sleep schedule', detail: 'Sleep directly supports brain recovery at this stage.' },
      { activity: 'Stay patient', detail: 'Every good choice you make today is building the foundation for full recovery.' },
      { activity: 'Cognitive load test', detail: 'A final Stage 2 cognitive check before you move forward.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Track your cognitive recovery progress.', interactive: 'reaction' },
    ],
    restricted: ['Do not return to sport or any high-risk physical activity', 'Do not push through symptoms', 'Do not pull all-nighters or allow your sleep to suffer', 'Do not consume alcohol'],
    warningSign: 'If symptoms return today, reset to Day 4. Do not push yourself into Stage 3.',
    insight: 'Tomorrow you move to Stage 3. Trusting the process when you feel fine is exactly what protects your long term brain health.',
  },
  7: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 40,
    cellularProcess: 'Research measuring a key brain energy marker called N-acetylaspartate in concussed athletes found it was 18.5% below normal at Day 3, and had barely changed by Day 15, meaning the brain\'s energy levels are still depleted at this point despite most people feeling completely well. Studies have also confirmed that reaction time can remain impaired for 21 to 59 days and balance for up to 30 days after a concussion, even after all symptoms disappear. This gap between how you feel and what is actually happening inside the brain is what makes this phase of recovery so important to manage carefully (Vagnozzi et al., 2008).',
    descriptionSimple: 'You may feel completely like yourself today, and that is a wonderful sign of how far your brain has come. What the research shows us is that the brain\'s internal energy is still quietly rebuilding, even when everything feels normal on the surface. A little more patience now gives your brain the chance to finish the work it has already done so well.',
    dailyGoal: 'Introduce running and sport specific movement today, but with zero contact or collision risk.',
    allowed: [
      { activity: 'Continue increasing activity gradually', detail: 'Only progress if you remain completely symptom-free.' },
      { activity: 'Maintain good sleep habits and eat well', detail: 'These directly support the ongoing recovery process.' },
      { activity: 'Light exercise if fully symptom-free', detail: 'Appropriate only if it does not cause any return of symptoms.' },
      { activity: 'Be honest about how you are truly feeling', detail: 'Do not downplay symptoms to yourself or others.' },
      { activity: 'Cognitive load test', detail: 'Track your brain speed as your physical load increases.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive recovery check.', interactive: 'reaction' },
    ],
    restricted: ['Do not return to sport or contact activity of any kind', 'Do not participate in any drills or training with collision risk', 'Do not engage in high-intensity exercise', 'Do not let others pressure you into returning before you are medically cleared', 'Do not assume that feeling symptom-free means you are fully healed'],
    warningSign: 'This is the most dangerous day of your recovery. You feel about 90% fine but your brain is at 40%. Do not be fooled.',
    insight: 'This is the Day 7 trap. Axonal connections in the damaged area are still regenerating and they are highly susceptible to re-injury right now.',
  },
  8: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 46,
    cellularProcess: 'Brain imaging studies of athletes around Day 8 confirm that how the brain uses oxygen and regulates its own blood flow is still measurably compromised, even without any outward symptoms. The slow structural breakdown of damaged nerve fibres continues to occur as a delayed consequence of the original impact. The brain is simultaneously managing reduced energy production, ongoing structural damage, and residual inflammation, all of which are normal parts of this stage of recovery (Compromised Resting Cerebral Metabolism, 2019).',
    descriptionSimple: 'Your brain is quietly managing several repair processes at once right now: restoring energy, reinforcing connections, and clearing inflammation. All of these processes are well underway, and your brain knows exactly what it needs to do. Your role is simply to keep supporting that process by taking it easy.',
    dailyGoal: 'Build on yesterday. Extend how long you train and add a little more skill complexity.',
    allowed: [
      { activity: 'Gradually increase cognitive tasks', detail: 'Short study or work periods are appropriate if symptom-free.' },
      { activity: 'Moderate exercise if symptom-free and cleared', detail: 'Appropriate only with medical clearance at this stage.' },
      { activity: 'Return to full school or work', detail: 'Only if you can do so without symptoms returning.' },
      { activity: 'Keep all follow-up medical appointments', detail: 'Stay consistent with your recovery plan.' },
      { activity: 'Cognitive load test', detail: 'Your daily digit span test.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Daily reaction test tracking your cognitive recovery.', interactive: 'reaction' },
    ],
    restricted: ['Do not participate in contact sports or any activity with collision risk', 'Do not train at game intensity', 'Do not skip medical follow-up appointments', 'Do not become overconfident because you feel well', 'Do not ignore any symptoms that return during activity'],
    warningSign: 'If fatigue lasts more than an hour after training, reduce the intensity tomorrow.',
    insight: 'Consistency across Days 7, 8 and 9 matters more than how hard any one session is.',
  },
  9: {
    stage: 3, stageName: 'Sport Specific Exercise', brainRecoveryPct: 52,
    cellularProcess: 'A study that directly measured brain function in concussed athletes using magnetic stimulation found that neurological function was still declining at Day 9, even as those athletes reported feeling better. This is a striking finding that confirms symptoms are not a reliable indicator of where the brain actually is in its recovery at this stage. The structural breakdown of damaged nerve fibres is still progressing today as part of a gradual biological process that began at the moment of impact (Frontiers in Sports — Longer Neurophysiological Recovery, 2021).',
    descriptionSimple: 'The research tells us your brain\'s internal recovery is still actively progressing in ways you simply cannot feel from the outside. Your brain is healing on its own timeline, and everything happening right now is part of a completely normal process.',
    dailyGoal: 'Push movement complexity to its limit today but keep the strict no contact rule in place.',
    allowed: [
      { activity: 'Follow your structured return-to-sport protocol', detail: 'Only if you have been cleared by a doctor.' },
      { activity: 'Non-contact drills and sport-specific skills', detail: 'Appropriate at this stage if completely symptom-free.' },
      { activity: 'Light cardio such as jogging or cycling', detail: 'Appropriate if cleared by your doctor.' },
      { activity: 'Light strength training', detail: 'Suitable if it does not provoke any symptoms.' },
      { activity: 'Monitor carefully for any return of symptoms', detail: 'During and after all activity today.' },
      { activity: 'Cognitive load test', detail: 'Check your cognitive speed before moving to Stage 4.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['Do not participate in any contact practice or drills', 'Do not head the ball or perform any heading drills', 'Do not do tackling drills or any collision-based training', 'Do not train at full sprint intensity', 'Do not put yourself in game or match situations'],
    warningSign: 'If you are symptom free at the end of today you are ready for Stage 4 tomorrow.',
    insight: 'You are past the halfway point. Over 50% of neurometabolic function is restored.',
  },
  10: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 58,
    cellularProcess: 'The mitochondria in the brain\'s cells are beginning to restore their normal energy production, but a key brain energy marker called N-acetylaspartate remains measurably below normal through the second week. The most significant period of brain metabolic recovery in the research actually occurs between Day 15 and Day 30, meaning the most powerful healing phase is still ahead (Giza & Hovda, 2001; Vagnozzi et al., 2008).',
    descriptionSimple: 'Your brain has come a long way from where it was on Day 1. The research tells us that the most powerful healing phase of your entire recovery is just around the corner, between Day 15 and Day 30. Everything you are doing right now is setting that phase up to go as well as possible.',
    dailyGoal: 'Return to full team training today but with zero contact.',
    allowed: [
      { activity: 'Progress to moderate-intensity exercise', detail: 'Only if you remain completely symptom-free.' },
      { activity: 'Sport-specific skills and drills without contact', detail: 'Continue building your fitness and skills.' },
      { activity: 'Monitor symptoms carefully through all activity', detail: 'Both during and after every session.' },
      { activity: 'Gradually return to your normal daily routine', detail: 'Increase load steadily if symptoms stay clear.' },
      { activity: 'Stay well hydrated and maintain good nutrition', detail: 'These support the recovery process at this stage.' },
      { activity: 'Cognitive load test', detail: 'Track cognitive recovery as your physical load increases.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['Do not participate in contact training of any kind', 'Do not play in matches or competitive situations', 'Do not train at competitive intensity', 'Do not ignore minor symptoms — they are a signal to reduce activity', 'Do not consume alcohol'],
    warningSign: 'Being back in the team environment creates pressure to make contact. Stick to the protocol.',
    insight: 'At 58% recovery your brain cannot handle a second impact. Second impact syndrome is still a real risk.',
  },
  11: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 63,
    cellularProcess: 'Around Day 11, an important shift begins, the brain moves from crisis stabilisation into active structural rebuilding. New connections between neurons start forming, and surviving nerve cells begin growing new branches to replace the ones that were damaged. A study measuring brain function directly in concussed athletes found that the neurological changes from the injury stabilised between Days 9 and 11, marking the end of the decline that had been occurring since the moment of impact. The metabolic recovery is still ongoing, but the trajectory has meaningfully changed (NIH — Neuronal Adhesion and Synapse Organisation; Frontiers in Sports, 2021).',
    descriptionSimple: 'Your brain has shifted from fighting to survive into actively rebuilding itself. New connections between brain cells are forming to replace the ones that were damaged, and this is a real and measurable milestone in your recovery. You are past the hardest part.',
    dailyGoal: 'Match your pre-injury training intensity in all non-contact areas today.',
    allowed: [
      { activity: 'Continue your graded return-to-sport protocol', detail: 'As directed by your doctor.' },
      { activity: 'Increase training intensity slightly if symptom-free', detail: 'Only if you remain completely clear of symptoms.' },
      { activity: 'Non-contact skills work and technical drills', detail: 'Appropriate at this stage.' },
      { activity: 'Team training without contact', detail: 'Suitable at this stage of recovery.' },
      { activity: 'Maintain a consistent sleep schedule', detail: 'Sleep supports the neuroplasticity rebuilding process.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['Do not participate in any full-contact training', 'Do not simulate match situations yet', 'Do not do high-collision drills', 'Do not rush through the protocol stages', 'Do not sacrifice sleep — it is essential for the brain\'s rebuilding process'],
    warningSign: 'If you feel cognitive fatigue during training, reduce your load.',
    insight: 'At 63% you are capable of playing. But being capable is not the same as being ready.',
  },
  12: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 67,
    cellularProcess: 'The brain\'s rebuilding process, known as neuroplasticity, is now well underway, with new synaptic connections forming and nerve fibres growing new branches across damaged regions. Research has found that gentle cognitive activity at this stage can actually support this process and increase the density of new connections by up to 25%. However, the energy system powering all of this repair work is still not back to full capacity, and the newly formed connections remain fragile until they are fully consolidated over time (Vagnozzi et al., 2008).',
    descriptionSimple: 'Your brain is in a genuine rebuilding phase right now, and light mental activity (reading, normal conversation, short tasks) is actually helping it build new connections. You are not just waiting to get better; your brain is actively constructing new pathways every single day. Support that process by staying comfortably within your limits.',
    dailyGoal: 'Sustain high intensity non-contact training throughout the session today.',
    allowed: [
      { activity: 'Progress to higher-intensity training if cleared', detail: 'Only if fully symptom-free and medically cleared.' },
      { activity: 'Controlled contact drills if cleared by doctor', detail: 'Appropriate at this stage only with medical clearance.' },
      { activity: 'Continue monitoring symptoms closely', detail: 'Throughout all activity at this stage.' },
      { activity: 'Return fully to school or work', detail: 'If you have not already done so.' },
      { activity: 'Maintain healthy habits', detail: 'Sleep, nutrition, and hydration all directly support the rebuilding process.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['Do not play in matches or game situations', 'Do not participate in full-speed contact drills', 'Do not assume you are fully healed because you feel well', 'Do not consume alcohol or drugs'],
    warningSign: 'A headache during high intensity exercise means reduce your load and reassess.',
    insight: 'Three more days of non-contact training. This discipline is what separates full recoveries from persistent symptoms.',
  },
  13: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 72,
    cellularProcess: 'Neuroplasticity continues to drive the brain\'s recovery, with new synapses forming and nerve fibres being remodelled across the areas affected by the original injury. The inflammatory response that has been present since the moment of impact is also progressively clearing, freeing up more of the brain\'s energy for repair and rebuilding (Vagnozzi et al., 2010).',
    descriptionSimple: 'Your brain is still actively growing new connections and reinforcing the pathways it has already rebuilt. The inflammation that has been quietly tiring your brain out since Day 1 is starting to clear, giving your cells more energy to put toward healing. The most powerful healing phase of your whole recovery begins in just two days.',
    dailyGoal: 'Push training intensity to its absolute limit within the no contact rule.',
    allowed: [
      { activity: 'Continue your return-to-sport progression', detail: 'Only if you remain completely symptom-free.' },
      { activity: 'Near-normal training if cleared', detail: 'Appropriate if you have been cleared and have no symptoms.' },
      { activity: 'Light controlled contact drills if cleared', detail: 'Suitable only if your doctor has specifically cleared you.' },
      { activity: 'Prepare mentally for return to competition', detail: 'You are very close to the finish line.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['Do not play in matches yet', 'Do not participate in full-intensity contact training', 'Do not let peer pressure from teammates or coaches rush your return', 'Do not consume alcohol'],
    warningSign: 'Any symptom at this stage means you need an immediate medical review.',
    insight: 'You are doing everything at match pace except making contact. You are 72% recovered with 8 days until clearance.',
  },
  14: {
    stage: 4, stageName: 'Non-Contact Training', brainRecoveryPct: 76,
    cellularProcess: 'At the two-week mark, research confirms that a key brain energy marker is still measurably below normal. The new neural connections formed through neuroplasticity over the past week are still consolidating and need continued stability to fully integrate into the brain\'s existing networks. Recovery timelines vary between individuals; research shows that 10 to 14% of athletes are still symptomatic at this stage, and that is a normal part of the process (Vagnozzi et al., 2008).',
    descriptionSimple: 'Your brain has made remarkable progress since Day 1. The new connections your brain has built are still solidifying, like concrete that needs a little more time to fully harden. If you are still experiencing some symptoms, that is completely okay. Everyone heals in their own time and your process is valid.',
    dailyGoal: 'Final non-contact session today. Confirm you are symptom free before progressing to Stage 5.',
    allowed: [
      { activity: 'Full training if symptom-free and cleared', detail: 'Appropriate if completely symptom-free with medical clearance.' },
      { activity: 'Controlled full-contact practice if cleared', detail: 'Can begin at this stage if cleared by your doctor.' },
      { activity: 'Continue monitoring symptoms through all activity', detail: 'Stay alert to any changes.' },
      { activity: 'Prepare for your formal medical clearance assessment', detail: 'Book your appointment if you have not already.' },
      { activity: 'Cognitive load test', detail: 'Final cognitive check before the contact phase begins.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['Do not play in matches without medical clearance', 'Do not take shortcuts in the protocol', 'Do not return to full activity if you have any doubt or lingering symptoms', 'Do not let pressure from coaches or teammates influence your decision', 'Do not consume alcohol'],
    warningSign: 'You must be completely symptom free at rest and during exercise before you can move on tomorrow.',
    insight: 'Day 14 symptom free. Tomorrow is a real milestone.',
  },
  15: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 80,
    cellularProcess: 'The most significant metabolic recovery happened between Day 15 and Day 30, making today the beginning of the most important healing phase of the entire recovery. Athletes who felt fully symptom-free from as early as Day 3 were still found to have measurable brain energy deficits at this point (Vagnozzi et al., 2008; 2010).',
    descriptionSimple: 'Today marks the start of the most powerful healing phase of your entire concussion recovery; the research shows that your brain makes its biggest energy gains from now until Day 30. Even people who felt completely fine from Day 3 were still quietly healing at this point, which shows just how important this final stretch really is. You are exactly where you should be, and the best is genuinely still ahead.',
    dailyGoal: 'Reintroduce controlled contact today in a supervised training environment.',
    allowed: [
      { activity: 'Complete your return-to-sport protocol training load', detail: 'If you are fully symptom-free.' },
      { activity: 'Match-simulation drills if cleared', detail: 'Appropriate at this stage if medically cleared.' },
      { activity: 'Attend your medical assessment for clearance', detail: 'Formal return-to-sport clearance is required.' },
      { activity: 'Trust the process', detail: 'Every step you have taken has been building to this point.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
      { activity: 'Reaction time test', detail: 'Your daily cognitive check.', interactive: 'reaction' },
    ],
    restricted: ['Do not play in competition without formal medical clearance', 'Do not skip your medical assessment', 'Do not engage in high-risk behaviour outside of sport that could result in a head injury', 'Do not consume alcohol', 'Do not sacrifice sleep in these final days'],
    warningSign: 'Any headache or dizziness during contact drills means stop immediately and return to Stage 4.',
    insight: 'Tell your coach and teammates this is your first contact session post-concussion. Being open about it protects you.',
  },
  16: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 84,
    cellularProcess: 'The mitochondria in the brain\'s cells are restoring their full energy production capacity, and the protective barrier around the brain that was disrupted at impact is largely re-established. Research found that athletes who had a second concussion before completing this phase required an additional 15 days to fully recover; confirming just how valuable each remaining day of protection is (Vagnozzi et al., 2008; NIH — Rehabilitation of Concussion).',
    descriptionSimple: 'Your brain is in its most productive healing phase of the entire recovery right now; energy production, chemical balance, and structural repair are all accelerating together. The protective barrier around your brain that was damaged on Day 1 is almost fully restored. Everything you have done to reach this point has set this final phase up to go as well as it possibly can.',
    dailyGoal: 'Progress your contact intensity today if yesterday was completely symptom free.',
    allowed: [
      { activity: 'Participate fully in training', detail: 'As directed by your return-to-sport protocol.' },
      { activity: 'Maintain healthy habits', detail: 'Sleep, nutrition, and hydration have carried you this far — keep going.' },
      { activity: 'Complete any required cognitive or physical testing', detail: 'As part of your clearance process.' },
      { activity: 'Prepare mentally and physically for return', detail: 'Confidence and readiness both matter.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['Do not return to competition without formal medical clearance', 'Do not engage in risky activities outside sport that could cause a head injury', 'Do not allow sleep or nutrition to slip in these final days', 'Do not become complacent', 'Do not consume alcohol'],
    warningSign: 'Symptoms on Day 16 after contact means return to Stage 4 and get a medical review.',
    insight: 'At 84% you are very close to full health. The remaining 16% continues repairing for weeks after you return.',
  },
  17: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 87,
    cellularProcess: 'The rapid metabolic recovery phase between Day 15 and Day 30 is progressing well. The brain\'s chemical messaging systems, including the neurotransmitters that regulate mood, focus, and coordination are returning to normal function. The new synaptic connections formed through neuroplasticity over the past week are strengthening and consolidating, approaching the structural integrity needed to safely handle the physical demands of contact sport (Vagnozzi et al., 2008; Frontiers in Sports, 2021).',
    descriptionSimple: 'Your brain\'s chemical systems: the signals that regulate how you think, feel, and move; are returning to normal, and that is a really meaningful sign of progress. The new neural connections built over the past week are getting stronger and more permanent with every passing day. You are in the final stretch of a recovery your brain has been working incredibly hard on.',
    dailyGoal: 'Full training at match intensity today including all contact situations.',
    allowed: [
      { activity: 'Continue your full training load', detail: 'As part of the return-to-sport protocol.' },
      { activity: 'Maintain your symptom-free status', detail: 'If any symptoms return, reduce activity immediately.' },
      { activity: 'Stay consistent with the protocol', detail: 'Follow all medical advice and attend any scheduled assessments.' },
      { activity: 'Plan carefully for a safe return to competition', detail: 'Four days until clearance — no unnecessary risks.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['Do not return to competition without medical clearance', 'Do not make risky decisions that could put your head at risk', 'Do not consume alcohol or recreational drugs', 'Do not allow poor sleep to undermine the recovery gains of the past two weeks', 'Do not overexert yourself'],
    warningSign: 'Four days until you return. Do not take risks that could push your timeline back.',
    insight: 'Players who complete every day of the protocol come back at 100%. Those who rush come back at 80%.',
  },
  18: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 90,
    cellularProcess: 'The mitochondria in the brain\'s cells are approaching their pre-injury energy production capacity, and neurotransmitter systems are normalising. The protective barrier around the brain has largely been restored, and the new neural connections formed through neuroplasticity are maturing into stable, permanent pathways. The inflammation that has been present since the moment of impact has largely resolved, removing a significant source of stress from the brain\'s cells (Giza & Hovda, 2001; Frontiers in Sports, 2021; Key Med Group, 2025).',
    descriptionSimple: 'Almost every system that was disrupted on Day 1 is now in its final stages of being restored, including your energy levels, your chemical balance, your brain\'s internal connections. The inflammation that has been quietly exhausting your brain cells for nearly three weeks has mostly cleared. Your brain has done something truly remarkable over these 18 days — you are almost there.',
    dailyGoal: 'Simulate match conditions as closely as possible in training today.',
    allowed: [
      { activity: 'Participate fully in training', detail: 'As part of your return-to-sport protocol.' },
      { activity: 'Prepare mentally for your return', detail: 'Confidence and readiness matter at this stage.' },
      { activity: 'Stay focused and consistent', detail: 'Through these final days of the protocol.' },
      { activity: 'Complete your medical clearance process', detail: 'If you have not already done so.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['Do not play in competition without formal medical clearance', 'Do not let overconfidence cause you to rush or skip the final steps', 'Do not engage in high-risk activities outside sport', 'Do not use alcohol or recreational substances', 'Do not sacrifice sleep in these final days'],
    warningSign: 'Three days from clearance. Any symptom now needs a medical review.',
    insight: 'You are 90% recovered. The final 10% continues for weeks after you return. That is completely normal.',
  },
  19: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 93,
    cellularProcess: 'The brain\'s key energy marker is on a confirmed path toward full normalisation at around Day 30, and the neurotransmitter systems including those governing mood, inhibition, and motor control are approaching their pre-injury function. The new synaptic connections formed since Day 11 are now structurally mature and integrating into the brain\'s existing neural networks (Giza & Hovda, 2001).',
    descriptionSimple: 'You are two days away from completing the 21-day recovery window that research identifies as the standard timeframe for concussion healing. The new connections your brain built during recovery are now fully mature and are a permanent part of your neural network — that is genuinely remarkable. The finish line is right there in front of you.',
    dailyGoal: 'Final preparation before medical clearance. Train with confidence today.',
    allowed: [
      { activity: 'Continue full training', detail: 'As part of your return-to-sport protocol.' },
      { activity: 'Attend your medical clearance appointment', detail: 'If scheduled — do not miss it.' },
      { activity: 'Stay completely symptom-free through all activity', detail: 'Two days from clearance. No risks.' },
      { activity: 'Prepare your equipment and mindset for return', detail: 'You have followed this process with care and commitment.' },
      { activity: 'Cognitive load test', detail: 'Your daily cognitive check.', interactive: 'cognitive' },
    ],
    restricted: ['Do not return to competition without formal clearance', 'Do not become complacent in these final two days', 'Do not engage in risky behaviour that could result in a head injury', 'Do not consume alcohol', 'Do not push beyond the protocol'],
    warningSign: 'Two days from clearance. No unnecessary risks.',
    insight: 'Most players do not make it this far without cutting corners. You have done it the right way.',
  },
  20: {
    stage: 5, stageName: 'Full Contact Practice', brainRecoveryPct: 96,
    cellularProcess: 'The brain is in the final stages of its neurometabolic recovery, with energy markers continuing their strongest gains of the entire process in this Day 15 to Day 30 window. Blood flow, neurotransmitter balance, mitochondrial function, and axonal connectivity have all been substantially restored over the past 20 days. Research confirmed that athletes who returned too early and sustained a second concussion required 45 days — rather than 30 — to achieve full recovery, making this final day of protected rest genuinely significant (Vagnozzi et al., 2008).',
    descriptionSimple: 'One more day. Your brain has rebuilt its energy system, restored its chemical balance, and grown an entirely new set of connections over the past 20 days — and that is something worth being proud of. Tomorrow, with your doctor\'s clearance, you return to the sport you love knowing your brain has done the work.',
    dailyGoal: 'Final training day before your medical clearance assessment tomorrow.',
    allowed: [
      { activity: 'Complete your final medical clearance assessment', detail: 'Book and attend today if not already scheduled.' },
      { activity: 'Participate in full training if symptom-free', detail: 'As approved by your doctor.' },
      { activity: 'Prepare everything for your return to competition', detail: 'Tomorrow is the day.' },
      { activity: 'Rest well tonight', detail: 'Quality sleep in these final hours still supports your brain recovery.' },
      { activity: 'Cognitive load test', detail: 'Final cognitive check before clearance.', interactive: 'cognitive' },
    ],
    restricted: ['Do not play in competition without your final medical clearance', 'Do not celebrate prematurely with alcohol', 'Do not engage in any risky behaviour that could result in a head injury', 'Do not overexert yourself today', 'Do not allow a late night to undermine three weeks of careful recovery'],
    warningSign: 'Any symptom today delays your clearance. See a doctor immediately.',
    insight: 'One day until clearance. You have protected your brain for 20 days. Tomorrow you return stronger.',
  },
  21: {
    stage: 6, stageName: 'Return to Play', brainRecoveryPct: 100,
    cellularProcess: 'Day 21 marks the completion of the neurometabolic recovery window that research identifies as the boundary between normal and prolonged concussion recovery. The three core systems disrupted at the moment of impact: the brain\'s ionic balance, its energy metabolism, and the structural integrity of its nerve fibres have been substantially restored through the brain\'s own natural recovery process and neuroplasticity-driven rebuilding. Return to full contact sport at this stage requires formal medical clearance, in line with guidelines from the CDC, NCAA, and the International Consensus Conference on Concussion in Sport (NIH — Days for Concussion Recovery; Giza & Hovda, 2001).',
    descriptionSimple: 'You did it. Three weeks ago your brain needed every bit of energy just to stabilise itself: today it has rebuilt, rewired, and restored itself through a process that is nothing short of remarkable. Get your medical clearance, step back onto the field, and carry with you what you now know about how extraordinary your brain really is.',
    dailyGoal: 'Get your medical clearance today and return to full competition.',
    allowed: [
      { activity: 'Obtain your formal medical clearance', detail: 'See your GP or sports medicine doctor for sign-off before you return.' },
      { activity: 'Return to full competition and match play', detail: 'Once medically cleared, you can play without any restrictions.' },
      { activity: 'Continue monitoring for symptoms after return', detail: 'In the days following your return, stay alert.' },
      { activity: 'Protect yourself going forward', detail: 'Use proper technique and always report symptoms immediately.' },
    ],
    restricted: ['Do not return to competition without your formal medical sign-off', 'Do not immediately play at maximum intensity', 'Do not ignore any symptoms that return after you resume play', 'Do not hide symptoms from coaches, teammates, or medical staff', 'Do not take unnecessary risks'],
    warningSign: 'If symptoms come back after you return to play, stop immediately and restart the protocol.',
    insight: 'You did it. 21 days. Every player who completes the full protocol comes back at 100%. Welcome back.',
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 1 — DATE AND DAY TRACKING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const injuryDate           = ref('')
const daysSinceInjury      = ref<number | null>(null)
const selectedDay          = ref<number | null>(null)
// Toggles between plain English (true) and scientific (false) brain description
const showSimpleDescription = ref(true)

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
// Step 1: Sleep  Step 2: Symptoms  Step 3: Exercises (Stage 2+)  Step 4: Journal
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
// One question at a time. Yes on any question jumps to result.
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
// Key format: "dayNumber-activityName" e.g. "7-Light jogging"
// Saved to localStorage under 'concovery_activities'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const checkedActivities = ref<Record<string, boolean>>({})

function toggleActivity(key: string) {
  checkedActivities.value[key] = !checkedActivities.value[key]
  localStorage.setItem('concovery_activities', JSON.stringify(checkedActivities.value))
}
function isActivityChecked(key: string) { return checkedActivities.value[key] || false }

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
// Three cycles: inhale 4s, hold 7s, exhale 8s
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
// Based on the SCAT5 digit span test. Sequence length increases with recovery.
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
// Five rounds. Green circle appears after 1.5 to 3.5 second random delay.
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
  if (ms < 250) return { label: 'Excellent, brain speed is fully recovered',                         color: '#1B7C3D' }
  if (ms < 350) return { label: 'Good, cognitive recovery is progressing well',                      color: '#38bfff' }
  if (ms < 450) return { label: 'Fair, keep following the recovery protocol',                        color: '#E65100' }
  return             { label: 'Still slow, your brain is still recovering. Do not rush your return', color: '#C62828' }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 10 — RECOVERY JOURNAL
// Saved to localStorage under 'concovery_journal'
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
// SECTION 11 — EXPANDABLE STAGE TIMELINE
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
// onMounted: restore saved data, check if returning from exercise page
// onUnmounted: clear all timers
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
// These update automatically whenever their dependencies change.
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

// Which day to show. Clicked day takes priority over actual current day.
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

const props = defineProps({
  brainStatus: {
    type: Object,
    default: () => ({
      title: 'What is happening in your brain',
      description: 'Neural pathway efficiency is approaching 65%. Neurotransmitter levels are largely back to normal and cognitive function has recovered significantly.'
    })
  }
})

</script>

<template>
  <div class="sr-root min-h-screen">

    <!-- HERO — matches home page Bebas Neue style -->
    <section class="sr-hero text-white">
      <div class="sr-hero-lines"></div>
      <div class="sr-hero-edge"></div>

      <div class="w-full py-24 relative z-10" style="padding-left:80px; padding-right:80px;">
        <div class="inline-flex items-center border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-[#38bfff] mr-2 animate-pulse"></span>
          <span class="text-white/50 text-xs font-medium tracking-widest uppercase">Your Recovery Journey</span>
        </div>

        <BlurReveal :delay="0.2" :duration="0.75">
          <h1 class="sr-hero-title text-white mb-6">
            LET'S FIND OUT<br>
            <span style="color:#38bfff;">WHERE</span> YOU ARE.
          </h1>
          <p class="text-white/55 text-lg font-light max-w-lg leading-relaxed">
            Tell us when it happened and we will guide you through every day of your recovery.
          </p>
        </BlurReveal>
      </div>

      <!-- EKG heartbeat line -->
      <div class="sr-ekg">
        <svg class="sr-ekg-svg" viewBox="0 0 1200 56" fill="none"
          xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <polyline
            points="0,28 80,28 100,28 115,4 130,52 145,8 160,28 240,28
                    320,28 340,28 355,4 370,52 385,8 400,28 480,28
                    560,28 580,28 595,4 610,52 625,8 640,28 720,28
                    800,28 820,28 835,4 850,52 865,8 880,28 960,28 1200,28"
            stroke="#38bfff" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
    </section>

    <!-- DATE INPUT -->
    <section class="sr-s1 py-28">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="sr-heading text-3xl font-bold mb-8">When did you get your concussion?</h2>

          <div class="relative inline-block mb-10">
            <button @click="showCalendar = !showCalendar" class="inline-flex items-center gap-3 border-2 border-[#38bfff] rounded-xl px-6 py-4 bg-white hover:bg-[#F5F8FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bfff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="sr-heading text-xl font-semibold">{{ injuryDate ? formatDisplayDate(injuryDate) : 'Select a date' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bfff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div v-if="showCalendar" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 sr-card rounded-2xl shadow-2xl border border-[#EBEBEB] p-4 z-50 w-80">
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
                  :class="isSelectedCalDay(day) ? 'bg-[#38bfff] text-[#07090e] shadow-md' : isToday(day) ? 'border-2 border-[#38bfff] text-[#38bfff]' : 'hover:bg-[#F5F8FF] text-[#1A1A1A]'"
                >{{ day }}</button>
              </div>
            </div>
          </div>

          <Transition name="fade-scale">
            <div v-if="daysSinceInjury !== null" class="sr-card rounded-2xl border border-[#EBEBEB] shadow-lg p-8">
              <div class="text-6xl font-black text-[#38bfff] mb-2" style="letter-spacing:-0.03em;">You are on Day {{ daysSinceInjury }}</div>
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
                        background: getDayStatus(day) === 'past' ? '#1B7C3D' : getDayStatus(day) === 'today' ? '#38bfff' : '#EBEBEB',
                        outline: selectedDay === day ? '2px solid #38bfff' : 'none',
                        outlineOffset: '2px'
                      }"
                    />
                    <!-- FIX: group-hover:text-[#5A7A9B] — was invalid group-hover:sr-muted -->
                    <span
                      class="text-sm font-bold transition-all"
                      :class="selectedDay === day || getDayStatus(day) === 'today' ? 'text-[#38bfff]' : 'text-transparent group-hover:text-[#5A7A9B]'"
                    >{{ day }}</span>
                  </button>
                </div>
                <div class="flex gap-4 justify-center">
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#1B7C3D]"/><span class="text-sm text-[#5A7A9B]">Past</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#38bfff]"/><span class="text-sm text-[#5A7A9B]">Today</span></div>
                  <div class="flex items-center gap-1.5"><div class="w-3 h-1.5 rounded-full bg-[#EBEBEB]"/><span class="text-sm text-[#5A7A9B]">Upcoming</span></div>
                </div>
              </div>

              <p v-if="daysUntilReturn && daysUntilReturn > 0" class="text-[#5A7A9B] mb-4 text-sm">{{ daysUntilReturn }} days until you can return to play</p>
              <p v-else-if="daysUntilReturn === 0" class="text-[#1B7C3D] font-semibold mb-4 text-sm">You have reached Day 21. Get medical clearance before returning.</p>
              <span v-if="currentStage" class="inline-block bg-[#38bfff] text-[#07090e] text-base font-semibold px-5 py-2 rounded-full">
                Stage {{ currentStage }}, {{ stages[currentStage - 1].name }}
              </span>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- BRAIN STATUS + ACTIVITIES -->
    <section v-if="viewingDay && viewingDayData" class="sr-s2 py-28">
      <div class="max-w-[1200px] mx-auto px-10">

        <!-- FIX: "(You are on Day N)" uses text-[#0a1628] so it's visible on light blue banner -->
        <div v-if="!isViewingToday" class="bg-[#38bfff]/10 border border-[#38bfff]/30 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bfff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span class="text-[#38bfff] text-base font-semibold">Previewing Day {{ viewingDay }}, {{ viewingDayData.stageName }}</span>
            <span class="text-xs font-medium text-[#0a1628]">(You are on Day {{ daysSinceInjury }})</span>
          </div>
          <button @click="selectedDay = null" class="text-xs text-[#38bfff] font-semibold hover:underline">Back to today</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Brain status card -->
          <div class="sr-card rounded-2xl p-10 border border-[#EBEBEB] shadow-sm">
            <span class="inline-block bg-[#38bfff]/10 text-[#38bfff] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Day {{ viewingDay }}, {{ viewingDayData.stageName }}
            </span>

            <div class="mb-6">
              <div class="flex justify-between text-sm text-[#5A7A9B] mb-1">
                <span>Brain recovery</span>
                <span class="font-bold text-[#38bfff]">{{ viewingDayData.brainRecoveryPct }}%</span>
              </div>
              <div class="h-5 bg-[#EBEBEB] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ width: `${viewingDayData.brainRecoveryPct}%`, background: viewingDayData.brainRecoveryPct < 40 ? '#C62828' : viewingDayData.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }"
                />
              </div>
            </div>

            <h3 class="text-base font-bold text-[#1A1A1A] mb-1">Your goal today</h3>
            <p class="text-[#38bfff] font-semibold text-sm mb-5">{{ viewingDayData.dailyGoal }}</p>

            <!-- Brain description toggle: Simple / Scientific -->
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-bold text-[#1A1A1A]">What is happening in your brain</h3>
              <div class="flex items-center gap-1 bg-[#f0f4f8] rounded-full p-1">
                <button
                  @click="showSimpleDescription = true"
                  class="text-xs font-semibold px-3 py-1 rounded-full transition-all"
                  :class="showSimpleDescription ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#5A7A9B] hover:text-[#1A1A1A]'"
                >Simple</button>
                <button
                  @click="showSimpleDescription = false"
                  class="text-xs font-semibold px-3 py-1 rounded-full transition-all"
                  :class="!showSimpleDescription ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#5A7A9B] hover:text-[#1A1A1A]'"
                >Scientific</button>
              </div>
            </div>
            <Transition name="fade-scale" mode="out-in">
              <p v-if="showSimpleDescription" key="simple"
                class="text-[#1A1A1A] text-base leading-relaxed mb-5">
                {{ viewingDayData.descriptionSimple }}
              </p>
              <p v-else key="science"
                class="text-[#5A7A9B] text-sm leading-relaxed mb-5 italic">
                {{ viewingDayData.cellularProcess }}
              </p>
            </Transition>

            <div class="bg-[#C62828]/10 border border-[#C62828] rounded-xl p-5 flex gap-2 mb-4">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p class="text-sm text-[#1A1A1A] font-semibold">{{ viewingDayData.warningSign }}</p>
            </div>

            <div class="bg-[#38bfff]/5 border border-[#38bfff]/20 rounded-xl p-5 flex gap-2">
              <svg class="flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bfff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p class="text-sm text-[#1A1A1A] italic leading-relaxed">{{ viewingDayData.insight }}</p>
            </div>
            <p class="text-sm text-[#5A7A9B] italic mt-4">Source: Giza and Hovda, 2014. Neurometabolic Cascade. AIS 2024</p>
          </div>

          <!-- Activities card -->
          <div class="sr-card rounded-2xl p-10 border border-[#EBEBEB] shadow-sm">
            <h3 class="text-3xl font-bold text-[#1A1A1A] mb-8">What you can do today</h3>

            <div class="mb-8">
              <div class="flex items-center gap-2 text-[#1B7C3D] font-bold text-base mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B7C3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Allowed Today
              </div>

              <div class="space-y-3" :key="`activities-${viewingDay}`">
                <div
                  v-for="(a, idx) in viewingDayData.allowed"
                  :key="a.activity"
                  class="activity-card flex items-start gap-4 sr-card-green border border-[#1B7C3D]/20 rounded-2xl p-5"
                  :class="isActivityChecked(`${viewingDay}-${a.activity}`) && !a.interactive ? 'opacity-60' : ''"
                  :style="{ animationDelay: `${idx * 90}ms` }"
                >
                  <div class="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center" :class="a.interactive ? 'bg-[#38bfff]/10' : 'bg-[#1B7C3D]/10'">
                    <svg v-if="getActivityIcon(a.activity) === 'sleep'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'breathing'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'cognitive'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'reaction'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'movement'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="m7.5 17.5 1-4.5 2.5 2 3-4.5"/><path d="m11 9-1 3h4l-1.5 4"/><path d="m16.5 17.5-1-4.5"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'swim'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 17c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><circle cx="16.5" cy="6.5" r="1.5"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'bike'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'gym'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5v14"/><path d="M18 5v14"/><path d="M2 9h4"/><path d="M18 9h4"/><path d="M2 15h4"/><path d="M18 15h4"/><path d="M6 9h12"/><path d="M6 15h12"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'stretch'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'study'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'sport'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
                    <svg v-else-if="getActivityIcon(a.activity) === 'medical'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="a.interactive ? '#38bfff' : '#1B7C3D'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
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
                        <button @click="startBreathing" class="text-xs bg-[#38bfff] text-[#07090e] px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-colors">Start breathing exercise</button>
                      </div>
                      <div v-else class="bg-[#F5F8FF] rounded-xl p-6 text-center">
                        <div class="relative w-16 h-16 mx-auto mb-2">
                          <svg class="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" stroke="#EBEBEB" stroke-width="6" fill="none"/>
                            <circle cx="40" cy="40" r="34" stroke="#38bfff" stroke-width="6" fill="none" :stroke-dasharray="`${(breathingProgress / 100) * 213.6} 213.6`" class="transition-all duration-1000"/>
                          </svg>
                          <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-sm font-bold text-[#38bfff] uppercase">{{ breathingPhase }}</span>
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
                        <button @click="startCognitiveTest" class="text-xs bg-[#38bfff] text-[#07090e] px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-colors">Start digit span test</button>
                        <span v-if="cognitiveHistory.length > 0" class="text-sm text-[#5A7A9B] ml-2">
                          Last: {{ cognitiveHistory[cognitiveHistory.length - 1].correct ? 'Correct' : 'Incorrect' }}, {{ cognitiveHistory[cognitiveHistory.length - 1].length }} digits
                        </span>
                      </div>
                      <div v-else-if="cognitivePhase === 'showing'" class="bg-[#F5F8FF] border border-[#38bfff]/20 rounded-xl p-6 text-center">
                        <p class="text-sm text-[#5A7A9B] mb-3">Watch the digits carefully</p>
                        <div class="h-16 flex items-center justify-center">
                          <Transition name="fade-scale" mode="out-in">
                            <span v-if="cognitiveShowDigit !== null" :key="cognitiveShowDigit" class="text-5xl font-black text-[#38bfff]">{{ cognitiveShowDigit }}</span>
                            <span v-else class="text-5xl font-black text-[#EBEBEB]">?</span>
                          </Transition>
                        </div>
                        <p class="text-sm text-[#5A7A9B] mt-2">{{ cognitiveCurrentIndex }} of {{ cognitiveSequence.length }} shown</p>
                      </div>
                      <div v-else-if="cognitivePhase === 'input'" class="bg-[#F5F8FF] border border-[#38bfff]/20 rounded-xl p-6">
                        <p class="text-sm text-[#5A7A9B] mb-3 text-center">Enter the digits in order</p>
                        <div class="flex gap-1 justify-center mb-3 min-h-[36px] flex-wrap">
                          <div v-for="(digit, i) in cognitiveInput" :key="i" class="w-8 h-8 bg-[#38bfff] text-[#07090e] rounded-lg flex items-center justify-center font-bold text-sm">{{ digit }}</div>
                          <div v-for="i in (cognitiveSequence.length - cognitiveInput.length)" :key="'e'+i" class="w-8 h-8 bg-white border-2 border-[#EBEBEB] rounded-lg"/>
                        </div>
                        <div class="grid grid-cols-3 gap-1 mb-2">
                          <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" @click="tapCognitiveDigit(n)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#38bfff] hover:text-[#07090e] transition-colors">{{ n }}</button>
                        </div>
                        <div class="grid grid-cols-3 gap-1">
                          <button @click="deleteCognitiveInput" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#C62828] hover:bg-[#FFF5F5] transition-colors">Del</button>
                          <button @click="tapCognitiveDigit(0)" class="py-2 bg-white border border-[#EBEBEB] rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-[#38bfff] hover:text-[#07090e] transition-colors">0</button>
                          <div/>
                        </div>
                      </div>
                      <div v-else-if="cognitivePhase === 'result'" class="rounded-xl p-6 text-center" :class="cognitiveResult === 'correct' ? 'bg-[#1B7C3D]/10 border border-[#1B7C3D]' : 'bg-[#C62828]/10 border border-[#C62828]'">
                        <p class="font-bold text-sm mb-1" :class="cognitiveResult === 'correct' ? 'text-[#1B7C3D]' : 'text-[#C62828]'">{{ cognitiveResult === 'correct' ? 'Correct sequence' : 'Incorrect sequence' }}</p>
                        <p class="text-sm text-[#5A7A9B] mb-1">Sequence: {{ cognitiveSequence.join(', ') }}</p>
                        <p class="text-sm text-[#5A7A9B] mb-3">Your input: {{ cognitiveInput.join(', ') }}</p>
                        <button @click="resetCognitive" class="text-xs text-[#38bfff] hover:underline">Try again</button>
                      </div>
                    </div>

                    <!-- Reaction time widget -->
                    <div v-if="a.interactive === 'reaction' && isViewingToday" class="mt-2">
                      <div v-if="reactionPhase === 'idle'">
                        <button @click="startReactionTest" class="text-xs bg-[#38bfff] text-[#07090e] px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-colors">Start reaction test</button>
                      </div>
                      <div v-else-if="reactionPhase === 'waiting'" @click="tapReaction" class="bg-[#F5F8FF] border-2 border-[#38bfff] rounded-xl p-5 text-center cursor-pointer hover:bg-[#EEF3FF] transition-colors">
                        <p class="text-xs font-semibold text-[#1A1A1A] mb-1">Round {{ reactionRound }} of 5</p>
                        <p class="text-sm text-[#5A7A9B]">Wait for the green circle...</p>
                        <div class="w-10 h-10 rounded-full bg-[#EBEBEB] mx-auto mt-2"/>
                      </div>
                      <div v-else-if="reactionPhase === 'ready'" @click="tapReaction" class="bg-[#1B7C3D]/10 border-2 border-[#1B7C3D] rounded-xl p-5 text-center cursor-pointer hover:bg-[#1B7C3D]/20 transition-colors">
                        <p class="text-xs font-semibold text-[#1A1A1A] mb-2">Tap now</p>
                        <div class="w-10 h-10 rounded-full bg-[#1B7C3D] mx-auto animate-pulse"/>
                      </div>
                      <div v-else-if="reactionPhase === 'result'" class="bg-[#F5F8FF] rounded-xl p-5 text-center">
                        <p class="text-base font-black text-[#38bfff]">{{ reactionResult }}ms</p>
                        <p class="text-xs font-semibold mb-2" :style="{ color: getReactionLabel(reactionResult).color }">{{ getReactionLabel(reactionResult).label }}</p>
                        <button @click="resetReaction" class="text-sm text-[#5A7A9B] hover:underline">Test again</button>
                      </div>
                    </div>

                    <div v-if="a.interactive && !isViewingToday" class="mt-2">
                      <span class="text-sm text-[#5A7A9B] italic">Available when you reach Day {{ viewingDay }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Restricted pills -->
            <div class="mb-6">
              <div class="flex items-center gap-2 text-[#C62828] font-bold text-base mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C62828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Not Today
              </div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="r in viewingDayData.restricted" :key="r"
                  class="inline-flex items-center gap-2 sr-card-red border border-[#C62828]/20 rounded-full px-4 py-2"
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

    <!-- CHECK-IN BUTTON -->
    <section v-if="daysSinceInjury && isViewingToday" class="sr-s3 py-16">
      <div class="max-w-[1200px] mx-auto px-10 text-center">
        <div class="bg-[#F5F8FF] border border-[#38bfff]/20 rounded-2xl p-8 max-w-xl mx-auto">
          <h2 class="text-xl font-bold text-[#1A1A1A] mb-2">Complete today's check-in</h2>
          <p class="text-[#5A7A9B] text-sm mb-6">
            Takes about 3 minutes. Track your sleep, symptoms{{ currentStage && currentStage >= 2 ? ', exercises' : '' }} and how you feel today.
          </p>
          <div class="flex gap-2 justify-center mb-6">
            <div v-for="i in totalCheckInSteps" :key="i" class="w-2 h-2 rounded-full bg-[#EBEBEB]" />
          </div>
          <button
            @click="openCheckIn"
            class="bg-[#38bfff] text-[#07090e] px-10 py-5 rounded-full font-semibold text-base hover:opacity-90 transition-colors flex items-center gap-3 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Start today's check-in
          </button>
        </div>
      </div>
    </section>

    <!-- CHECK-IN MODAL — Sleep → Symptoms → Neck Exercises → Journal -->
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
                class="h-full bg-[#38bfff] rounded-full transition-all duration-500"
                :style="{ width: `${(checkInStep / totalCheckInSteps) * 100}%` }"
              />
            </div>
          </div>

          <div class="px-10 py-10 min-h-[440px]">
            <Transition name="slide-up" mode="out-in">

              <!-- STEP 1: Sleep -->
              <div v-if="checkInStep === 1" key="sleep">
                <div class="text-[#38bfff] text-xs font-semibold tracking-widest uppercase mb-2">Sleep</div>
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
                  <button @click="nextCheckInStep" class="w-full bg-[#38bfff] text-[#07090e] py-5 rounded-full font-semibold hover:opacity-90 transition-colors">Continue</button>
                </div>
              </div>

              <!-- STEP 2: Symptoms -->
              <div v-else-if="checkInStep === 2" key="symptoms">
                <div class="text-[#38bfff] text-xs font-semibold tracking-widest uppercase mb-2">Symptoms</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">How are you feeling today?</h3>
                <p class="text-[#5A7A9B] text-base mb-10">Be honest with yourself. This affects your recovery timeline.</p>

                <div v-if="symptomStep === 0" class="text-center">
                  <button @click="startSymptomCheck" class="w-full bg-[#38bfff] text-[#07090e] py-5 rounded-full font-semibold hover:opacity-90 transition-colors">Start symptom check</button>
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
                        <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full transition-all" :class="i <= symptomStep ? 'bg-[#38bfff]' : 'bg-[#EBEBEB]'" />
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        Find a clinic near me
                      </button>
                    </router-link>
                  </div>
                  <button @click="nextCheckInStep" class="w-full bg-[#38bfff] text-[#07090e] py-5 rounded-full font-semibold hover:opacity-90 transition-colors">Continue</button>
                </div>
              </div>

              <!-- STEP 3: Neck Exercises (Stage 2 and above only) -->
              <div v-else-if="checkInStep === 3 && currentStage && currentStage >= 2" key="exercises">
                <div class="text-[#38bfff] text-xs font-semibold tracking-widest uppercase mb-2">Neck Exercises</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">Time for your neck exercises</h3>
                <p class="text-[#5A7A9B] text-sm mb-6">
                  You will be taken to a guided exercise page with optional camera support.
                  When you finish, you will come straight back here to write your journal entry.
                </p>

                <div class="space-y-3 mb-6">
                  <div
                    v-for="(def, idx) in exerciseDefinitions" :key="idx"
                    class="border border-[#EBEBEB] bg-white rounded-xl p-6 flex items-center justify-between"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-[#38bfff]/10 flex items-center justify-center flex-shrink-0">
                        <span class="text-sm font-bold text-[#38bfff]">{{ idx + 1 }}</span>
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
                  class="w-full bg-[#38bfff] text-[#07090e] py-5 rounded-full font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  Start neck exercises
                </button>

                <button @click="nextCheckInStep" class="w-full py-3 rounded-full text-base font-semibold text-[#5A7A9B] hover:text-[#1A1A1A] transition-colors">
                  Skip for now
                </button>
              </div>

              <!-- STEP 4 (or Step 3 on Stage 1): Journal -->
              <div v-else key="journal">
                <div class="text-[#38bfff] text-xs font-semibold tracking-widest uppercase mb-2">Recovery Journal</div>
                <h3 class="text-3xl font-bold text-[#1A1A1A] mb-3">Write about your day</h3>
                <p class="text-[#5A7A9B] text-sm mb-6">One sentence is enough. Saved privately on this device only.</p>

                <div class="bg-[#F7F9FC] border border-[#EBEBEB] rounded-xl p-6 mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-base font-semibold text-[#38bfff]">Day {{ daysSinceInjury }}</span>
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
                    class="flex-1 bg-[#38bfff] text-[#07090e] py-5 rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

    <!-- 6 STAGE TIMELINE -->
    <section v-if="daysSinceInjury && currentStage" class="sr-s4 py-28">
      <div class="max-w-[1200px] mx-auto px-10">
        <div class="text-center mb-12">
          <h2 class="sr-heading text-4xl font-bold mb-4">Your full recovery journey</h2>
          <p class="text-[#5A7A9B]">Australian Institute of Sport 2024 mandatory protocol. Click any stage to explore the days inside it.</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="stage in stages" :key="stage.id"
            class="rounded-2xl border-2 overflow-hidden transition-all duration-300"
            :class="{ 'border-[#38bfff]': getStageStatus(stage.id) === 'current', 'border-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'border-[#EBEBEB]': getStageStatus(stage.id) === 'upcoming' }"
          >
            <button
              @click="toggleStage(stage.id)"
              class="w-full flex items-center justify-between p-7 transition-colors text-left"
              :class="{ 'bg-[#38bfff] text-[#07090e]': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]/10 text-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#f0f4f8] text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="{ 'bg-[#07090e]/10': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D]': getStageStatus(stage.id) === 'complete', 'bg-[#EBEBEB]': getStageStatus(stage.id) === 'upcoming' }"
                >
                  <svg v-if="getStageStatus(stage.id) === 'complete'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else class="text-sm font-black" :class="{ 'text-[#07090e]': getStageStatus(stage.id) === 'current', 'text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }">{{ stage.id }}</span>
                </div>
                <div>
                  <div class="font-bold text-base">{{ stage.name }}</div>
                  <div class="text-sm opacity-70 mt-1">Days {{ stage.days }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-bold px-3 py-1 rounded-full"
                  :class="{ 'bg-[#07090e]/10 text-[#07090e]': getStageStatus(stage.id) === 'current', 'bg-[#1B7C3D] text-white': getStageStatus(stage.id) === 'complete', 'bg-[#5A7A9B]/20 text-[#5A7A9B]': getStageStatus(stage.id) === 'upcoming' }"
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
                    :class="dayEntry.day === daysSinceInjury ? 'border-[#38bfff] bg-[#F5F8FF]' : 'border-[#EBEBEB]'"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-bold text-[#38bfff]">Day {{ dayEntry.day }}</span>
                      <span
                        class="text-sm font-bold px-2 py-0.5 rounded-full"
                        :class="dayEntry.day < (daysSinceInjury || 0) ? 'bg-[#1B7C3D]/10 text-[#1B7C3D]' : dayEntry.day === daysSinceInjury ? 'bg-[#38bfff] text-[#07090e]' : 'bg-[#EBEBEB] text-[#5A7A9B]'"
                      >{{ dayEntry.day < (daysSinceInjury || 0) ? 'Done' : dayEntry.day === daysSinceInjury ? 'Today' : 'Upcoming' }}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="h-1.5 flex-1 bg-[#EBEBEB] rounded-full overflow-hidden">
                        <div class="h-full rounded-full" :style="{ width: `${dayEntry.brainRecoveryPct}%`, background: dayEntry.brainRecoveryPct < 40 ? '#C62828' : dayEntry.brainRecoveryPct < 70 ? '#E65100' : '#1B7C3D' }"/>
                      </div>
                      <span class="text-sm font-bold text-[#5A7A9B]">{{ dayEntry.brainRecoveryPct }}%</span>
                    </div>
                    <p class="text-sm text-[#5A7A9B] leading-relaxed line-clamp-2">{{ dayEntry.dailyGoal }}</p>
                    <p class="text-xs text-[#38bfff] font-semibold mt-2">View this day</p>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- SUPPORT CTA — always dark -->
    <section style="background:#0A1628;" class="py-20 text-center">
      <div class="max-w-[1200px] mx-auto px-10">
        <h2 class="text-3xl font-bold text-white mb-4">Not sure if you are ready?</h2>
        <p class="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">Find the nearest GP, sports medicine clinic or hospital for a professional assessment.</p>
        <router-link to="/locatesupport">
          <button class="bg-[#38bfff] text-[#07090e] px-10 py-5 rounded-full font-semibold hover:opacity-90 transition-colors flex items-center gap-2 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Find a clinic near me
          </button>
        </router-link>
        <p class="text-white/30 text-sm">Medical clearance is required before returning to full contact sport</p>
      </div>
    </section>

  </div>
</template>


<style>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   All colours hardcoded — toggle has zero effect.
   Hero and Support CTA stay dark via inline/scoped styles.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* Root — always light */
.sr-root { background: #f0f4f8; }

/* Section backgrounds — hardcoded, alternating light */
.sr-s1 { background: #ffffff; }
.sr-s2 { background: #EBF5FF; }
.sr-s3 { background: #ffffff; }
.sr-s4 { background: #EBF5FF; }

/* Cards — always white */
.sr-card { background: #ffffff; }

/* Text — always dark */
.sr-heading { color: #1A1A1A; }
.sr-muted   { color: #5A7A9B; }
.sr-body    { color: #1A1A1A; }

/* Activity card tints */
.sr-card-green { background: #F5FFF7; }
.sr-card-red   { background: #FFF5F5; }
</style>

<style scoped>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO — Bebas Neue, matches home page exactly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.sr-hero {
  position: relative;
  background: #07090e;
  overflow: hidden;
  min-height: 380px;
  display: flex;
  align-items: center;
}
.sr-hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 8vw, 96px);
  line-height: 1.02;
  letter-spacing: 2px;
}

/* Diagonal speed lines */
.sr-hero-lines {
  position: absolute; inset: 0;
  overflow: hidden; pointer-events: none; z-index: 1;
}
.sr-hero-lines::before {
  content: '';
  position: absolute; top: -200%; left: -50%; width: 200%; height: 400%;
  background-image: repeating-linear-gradient(
    -65deg, transparent, transparent 80px,
    rgba(56,191,255,0.025) 80px, rgba(56,191,255,0.025) 81px
  );
  animation: srLinesDrift 22s linear infinite;
}
@keyframes srLinesDrift {
  from { transform: translateX(0); }
  to   { transform: translateX(81px); }
}

/* Left ice-blue edge bar */
.sr-hero-edge {
  position: absolute; left: 0; top: 15%; bottom: 15%;
  width: 3px; z-index: 2;
  background: linear-gradient(to bottom, transparent, #38bfff 40%, #38bfff 60%, transparent);
}

/* EKG heartbeat scrolling line */
.sr-ekg {
  position: absolute; bottom: 20px; left: 80px; right: 80px;
  z-index: 3; height: 56px; overflow: hidden; opacity: 0.25;
}
.sr-ekg-svg {
  width: 200%; height: 100%;
  animation: srEkgScroll 3s linear infinite;
}
@keyframes srEkgScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ACTIVITY CARDS — staggered slide-in animation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.activity-card {
  opacity: 0;
  animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE & MODAL TRANSITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-scale-enter-from,   .fade-scale-leave-to     { opacity: 0; transform: scale(0.97); }

.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-up-enter-from    { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to      { opacity: 0; transform: translateY(-16px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.modal-enter-from,   .modal-leave-to     { opacity: 0; transform: scale(0.96); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
