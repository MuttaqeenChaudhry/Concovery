<script setup>
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue';
// Char js Imports & Defaults
import { Bar, Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { onMounted, ref } from 'vue';
import axios from 'axios';
import Spinner from '@/components/custom-components/spinner.vue';

const sportsType = ref(null)
const ageGroup = ref(null)
const sportsDropdown = ref(null)
const ageGroupDropdown = ref(null)
const concussionData = ref(null)
const fetchingDropdowns = ref(false)
const fetchingSportsData = ref(false)
const fetchingAgeData = ref(false)
const fetchingTrendData = ref(false)
const fetchingSportsComparisonData = ref(null)

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale)
const topThreeSports = ref([])

const sportsChartData = ref({
    labels: ['Male', 'Female'],

    datasets: [
        {
            label: 'Year 2023-24',
            data: [],
            backgroundColor: ['blue', 'pink'],
            borderRadius: 5
        }
    ]
})

const ageChartData = ref({
    labels: ['Male', 'Female'],

    datasets: [
        {
            label: 'Year 2023-24',
            data: [],
            backgroundColor: ['black', 'gray'],
            borderRadius: 5
        }
    ]
})

const percentageChangeMale = ref(null)
const percentageChangeFemale = ref(null)

const trendAnalysisChartData = ref({
    labels: ['0', '0', '0', '0'],
    datasets: [
        {
            label: 'Male',
            data: [0, 0, 0, 0],
            borderColor: '#007aff',
            backgroundColor: 'black',
            tension: 0.8, // smooth curve
            fill: true,
            pointRadius: 4
        },
        {
            label: 'Female',
            data: [0, 0, 0, 0],
            borderColor: '#ff2d55',
            backgroundColor: 'black',
            tension: 0.8, // smooth curve
            fill: true,
            pointRadius: 4
        }
    ]
})

const sportsComparisonData = ref({
    labels: ['Male', 'Female'],

    datasets: [
        {
            label: 'Year 2023-24',
            data: [],
            backgroundColor: ['#007aff', '#5ac8fa', '#34c759', '#ff9500', '#ff2d55', '#af52de', '#ffcc00', '#ff3b30', 'black', 'gray', '#ff3b30', '#af52de', '#5ac8fa', '#007aff' ],
            borderRadius: 5
        }
    ]
})

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'bottom', labels: { color: 'black', pointStyle: 'rectangle', usePointStyle: false } },
        tooltip: { enabled: true }
    },
    scales: {
        x: {
            ticks: { color: 'black' }
        },
        y: { beginAtZero: true, ticks: { stepSize: 1, color: 'black' } }
    }
}

const chartOptionsTwo = {
    responsive: true,
    plugins: {
        legend: {
            position: 'left',
            labels: { color: 'black' }
        },
        tooltip: { enabled: true }
    },
    scales: {
        x: { ticks: { color: 'black' } },
        y: { beginAtZero: true, ticks: { color: 'black' } }
    }
}


const compChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
        legend: {
            position: 'left',
            labels: { color: 'black' }
        },
        tooltip: { enabled: true }
    },
    scales: {
        x: { ticks: { color: 'black' } },
        y: { beginAtZero: true, ticks: { color: 'black' } }
    }
}

const applySportsFilter = async () => {
    fetchingSportsData.value = true
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/postgres/sportsFilter?sportsType=${sportsType.value} `)
        if(response.status == 200) {
            fetchingSportsData.value = false
            sportsChartData.value = {
                ...sportsChartData.value,
                datasets: [{
                    ...sportsChartData.value.datasets[0],
                    data: [response?.data[0]?.measure_value, response?.data[1]?.measure_value]
                }]

            }
        }
        
    } catch (error) {
        fetchingSportsData.value = false
        console.log("================================ ")
        console.log("Error caught in filterData function  , ", error)
    } finally {
        fetchingSportsData.value = false
    }
}

const applyAgeFilter = async () => {
    fetchingAgeData.value = true
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/postgres/ageFilter?ageGroup=${ageGroup.value} `)
        if(response.status == 200) {
            fetchingAgeData.value = false
            console.log("Response for ageFilter is", response)
            ageChartData.value = {
                ...ageChartData.value,
                datasets: [{
                    ...ageChartData.value.datasets[0],
                    data: [response?.data[0]?.measure_value, response?.data[1]?.measure_value]
                }]

            }
        }
        
    } catch (error) {
        fetchingAgeData.value = false
        console.log("================================ ")
        console.log("Error caught in filterData function  , ", error)
    } finally {
        fetchingAgeData.value = false
    }
}

const fetchDropdownOptions = async () => {
    fetchingDropdowns.value = true
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/postgres/fetchdropdownsdata`)
        if (response.status == 200) {
            fetchingDropdowns.value = false
            ageGroupDropdown.value = response?.data?.age_group_results?.rows            
            sportsDropdown.value = response?.data?.sports_result?.rows  
            console.log("The dropdown options for age group are ", ageGroupDropdown.value)
            console.log("The dropdown options for sports are ", sportsDropdown.value)
        } else {
             fetchingDropdowns.value = false
             console.log("Response is else: ", response)
        }
    } catch (error) {
        fetchingDropdowns.value = false
        console.log("Error caught in filterData function  , ", error)
    } finally {
        fetchingDropdowns.value = false
    }
}

const processAnalysisData = (maleData, femaleData) => {
    let labels = []
    let data1 = []
    let data2 = []
    for(const prop of maleData) {
        labels.push(prop.year_start)
        data1.push(prop.hospitalisation_count)
    }
    percentageChangeMale.value = (((data1[data1.length - 1] - data1[0]) / data1[0]) * 100).toFixed(1) 
    for(const prop of femaleData) {
        data2.push(prop.hospitalisation_count)
    }
    percentageChangeFemale.value = (((data2[data2.length - 1] - data2[0]) / data2[0]) * 100).toFixed(1) 
    trendAnalysisChartData.value = {
        ...trendAnalysisChartData.value,
        labels: labels,
        datasets: [{
            ...trendAnalysisChartData.value.datasets[0],
            data: data1
        },
        {   
            ...trendAnalysisChartData.value.datasets[1],
            data: data2
        }]
    }    
}


const fetchChartTrendAnalysisData = async () => {
     fetchingTrendData.value = true
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/postgres/trendAnalysis`)
        if(response.status == 200) {
            processAnalysisData(response?.data?.MaleTrendAnalysis?.rows, response?.data?.FemaleTrendAnalysis?.rows)
        }     
    } catch (error) {
        fetchingTrendData.value = false
        console.log("================================ ")
        console.log("Error caught in fetchingTrendData function: ", error)
    } finally {
        fetchingTrendData.value = false
    }

}

const processSportsComparisonData = (inputData) => {
    let labels = []
    let data = []
    for(const sportData of inputData){
        labels.push(sportData?.sport_name)
        data.push(sportData?.rate_per_100000)
    }
    sportsComparisonData.value = {
        ...sportsComparisonData.value,
        labels: labels,
        datasets: [{
            ...sportsComparisonData.value.datasets[0],
            data: data
        }]
    }
    topThreeSports.value = [labels[0], labels[1], labels[2]]
    console.log("Top Three Sports are: ", topThreeSports)
}

const fetchSportsComparisonData = async () => {
     fetchingSportsComparisonData.value = true
    try {
        const response = await axios.get(`https://site--concovery-backend--gvxxw7q2vn57.code.run/postgres/sportComparison`)
        if(response.status == 200) {
           processSportsComparisonData(response?.data)
        }     
    } catch (error) {
        fetchingSportsComparisonData.value = false
        console.log("================================ ")
        console.log("Error caught in fetchingSportsComparisonData function: ", error)
    } finally {
        fetchingSportsComparisonData.value = false
    }
}

const fetchConcussionData = async (funcToCall) => {
    try {
        await applySportsFilter()
        await applyAgeFilter()   
    } catch (error) {
        console.error("Error occurred while fetching concussion data: ", error)
    } 
}

onMounted(async() => {
    // Fetching live categories from the database
    await fetchDropdownOptions()
    sportsType.value = "Australian Rules Football"
    ageGroup.value = "15-24"
    await applySportsFilter()
    await applyAgeFilter()
    await fetchChartTrendAnalysisData()
    await fetchSportsComparisonData()
}
)
</script>

<template>
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20"
        data-fg-dqrj1="33.110:33.18481:/src/app/pages/Data.tsx:109:7:3530:14934:e:div:xtetxtetxtetxtetxte"
        data-fgid-dqrj1=":r17r:">
        <div class="text-center mb-16" style="opacity: 1; transform: none;">
            <BlurReveal :delay="0.2" :duration="0.75">
                <h1 class="text-5xl sm:text-7xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
                    Concussion Data Explorer</h1>
                <p class="text-xl sm:text-2xl text-[#86868b] max-w-3xl mx-auto">
                    Real injury data from Australian community sport. Understand the scale and trends of concussion
                    across
                    different sports and age groups.
                </p>
            </BlurReveal>
        </div>
        <!-- Dropdown Menus -->
        <div class="bg-[#f5f5f7] rounded-3xl p-8 mb-12 shadow-lg" style="opacity: 1; transform: none;">
            <div class="flex justify-center items-center gap-3 mb-6">
                <div class="bg-[#007aff] rounded-2xl p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-funnel text-white">
                        <path
                            d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z">
                        </path>
                    </svg>
                </div>
                <h2 class="text-2xl font-semibold text-[#1d1d1f]">Filter Data</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                <!-- Sports Dropdown -->
                <div>
                    <label class="block text-[#1d1d1f] font-semibold mb-3 text-sm uppercase tracking-wide">
                        What kind of sport do you like ?
                    </label>
                    <select v-if="sportsDropdown" v-model="sportsType"
                        class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg font-medium focus:outline-none focus:border-[#007aff] transition-colors">
                        <option v-for="sportItr in sportsDropdown" :value="sportItr.sport_name">{{ sportItr.sport_name }}</option>
                    </select>
                    <span v-else>
                        <span v-if="fetchingDropdowns" class="animate-pulse font-bold">Loading . . .</span>
                        <span v-else>
                            Please refresh and try again
                        </span>
                    </span>
                </div>
                <!-- <div class="flex justify-center items-center py-6">
                    <button @click="() => applySportsFilter()" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none bg-[#007aff] hover:bg-[#0051d5] text-white px-10 py-6 text-lg rounded-full font-semibold shadow-lg shadow-blue-500/25 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-funnel text-white" data-v-inspector="src/pages/ConcussionDataExplorer.vue:110:21"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" data-v-inspector="src/pages/ConcussionDataExplorer.vue:113:25"></path></svg>
                        <span class="animate-pulse" v-if="fetchingSportsData">Working ....</span>
                        <span v-else>Apply Filter</span>
                    </button>
                </div> -->
                <!-- Agegroup Dropdown -->
                <div>
                    <label class="block text-[#1d1d1f] font-semibold mb-3 text-sm uppercase tracking-wide">
                        Which age group would you like to explore ?
                    </label>
                    <select v-if="ageGroupDropdown" v-model="ageGroup"
                        class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg font-medium focus:outline-none focus:border-[#007aff] transition-colors">
                        <option v-for="ageGroupItr in ageGroupDropdown" :value="ageGroupItr.age_group_label">{{ ageGroupItr.age_group_label }}</option>
                    </select>
                    <span v-else>
                        <span v-if="fetchingDropdowns" class="animate-pulse font-bold">Loading . . .</span>
                        <span v-else>
                            Please refresh and try again
                        </span>
                    </span>
                </div>
            </div>
            <div>
                 <div class="flex justify-center items-center py-6">
                    <button @click="() => fetchConcussionData()" data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none bg-[#007aff] hover:bg-[#0051d5] text-white px-10 py-6 text-lg rounded-full font-semibold shadow-lg shadow-blue-500/25 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-funnel text-white" data-v-inspector="src/pages/ConcussionDataExplorer.vue:110:21"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" data-v-inspector="src/pages/ConcussionDataExplorer.vue:113:25"></path></svg>
                        <span class="animate-pulse" v-if="fetchingAgeData || fetchingSportsData">Working ....</span>
                        <span v-else>Apply Filter</span>
                    </button>
                </div>
            </div>
            
        </div>
        <!-- Bar Chart Section -->
        <div class="bg-white rounded-3xl p-10 mb-12 shadow-2xl shadow-black/5 border border-[#d2d2d7]/50"
            style="opacity: 1; transform: none;">
            <div class="flex items-start justify-between mb-8">
                <div>
                    <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3">Concussion Hospitalisations by Sports & Age Group</h3>
                    <p class="text-[#86868b] text-lg">Sport: {{ sportsType ?? 'Loading ..' }}</p>
                </div>
            </div>
            <!-- Bar Chart Section -->
            <div class="h-80 mb-8 flex items-center justify-center font-bold">
                <Bar :data="sportsChartData" :options="chartOptions" />
            </div>
            <div class="flex items-start justify-between mb-8">
                <div>
                    <p class="text-[#86868b] text-lg">Age Group: {{ ageGroup ?? 'Loading ..' }}</p>
                </div>
            </div>
            <div class="h-80 mb-8 flex items-center justify-center font-bold">
                <Bar :data="ageChartData" :options="chartOptions" />
            </div>
            <div class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-6 border border-[#007aff]/30">
                <div class="text-[#1d1d1f] text-lg leading-relaxed"><strong>Key Insights: </strong>
                    <p v-if="sportsChartData.datasets[0].data.length > 0">
                        - From 2023-24, {{ Number(sportsChartData.datasets[0].data[0])+Number(sportsChartData.datasets[0].data[1])}} concussion hospitalisations were recorded for {{ sportsType }}.
                    </p>
                    <p v-else class="animate-pulse">
                        Loading ...
                    </p>
                    <p v-if="sportsChartData.datasets[0].data.length > 0">
                        {{ parseFloat(sportsChartData.datasets[0].data[0]) > parseFloat(sportsChartData.datasets[0].data[1]) ?
                        `- Male sustained more hospitalizations overall for ${sportsType}` : `- Female sustained more hospitalizations overall for ${sportsType}`}}
                    </p>
                    <p v-else class="animate-pulse">
                        Loading ...
                    </p>
                    <p v-if="ageChartData.datasets[0].data.length > 0">
                        {{ parseFloat(ageChartData.datasets[0].data[0]) > parseFloat(ageChartData.datasets[0].data[1]) ?
                        `- For the age-group ${ageGroup} Males sustained more hospitalizations count`  : `- For the age-group ${ageGroup} Females sustained more hospitalizations count`}}
                    </p>
                    <p v-else class="animate-pulse">
                        Loading ...
                    </p>
                </div>
            </div>
            <p class="text-[#86868b] text-sm mt-4"
                data-fg-dqrj67="33.110:33.18481:/src/app/pages/Data.tsx:233:11:9016:164:e:p:t"
                data-fgid-dqrj67=":r194:">Source: Australian Institute of Health and Welfare (AIHW), Sports Injury in
                Australia 2023-24</p>
        </div>
        <!-- Line Chart Section -->
        <div class="bg-white rounded-3xl p-10 mb-12 shadow-2xl shadow-black/5 border border-[#d2d2d7]/50"
            style="opacity: 1; transform: none;">
            <div class="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-trending-up text-[#007aff]"
                            data-fg-dqrj74="33.110:33.18481:/src/app/pages/Data.tsx:248:17:9716:67:e:TrendingUp::::::tM8"
                            data-fgid-dqrj74=":r199:">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                        10-Year Trend Analysis
                    </h3>
                    <p class="text-[#86868b] text-lg">Concussion hospitalisation rates for <span class="animate-pulse" v-if="fetchingTrendData">Loading ...</span><span v-else>2014 - 2023</span></p>
                </div>
            </div>
            <div class="h-96 mb-8 flex items-center justify-center font-bold">
                <Line :data="trendAnalysisChartData" :options="chartOptionsTwo" />
            </div>
            <div class="space-y-4">  
                <div
                    class="bg-gradient-to-br from-[#34c759]/10 to-[#34c759]/5 rounded-2xl p-6 border border-[#34c759]/30">
                    <div class="flex items-start gap-3">
                        <div class="bg-[#34c759] rounded-lg p-2 flex-shrink-0"></div>
                        <div>
                            <p class="text-[#1d1d1f] font-semibold mb-1">Key Insight: Male</p>
                            <div v-if="percentageChangeMale" class="text-[#1d1d1f]"><strong>-></strong> {{ percentageChangeMale }}% {{ percentageChangeMale > 0 ? 'increase' : 'decrease' }}
                                <p>
                                    <strong>-></strong> Still the highest risk. Concussions are going down, but boys are still far more likely to get injured - especially in contact sports.
                                </p>
                            </div>
                            <div v-else class="animate-pulse">Loading ...</div>
                        </div>
                    </div>
                </div>
                <div
                    class="bg-gradient-to-br from-[#34c759]/10 to-[#34c759]/5 rounded-2xl p-6 border border-[#34c759]/30">
                    <div class="flex items-start gap-3">
                        <div class="bg-[#34c759] rounded-lg p-2 flex-shrink-0"></div>
                        <div>
                            <p class="text-[#1d1d1f] font-semibold mb-1">Key Insight: Female</p>
                            <div v-if="percentageChangeFemale" class="text-[#1d1d1f]"><strong>-></strong> {{ percentageChangeFemale }}% {{ percentageChangeFemale > 0 ? 'increase' : 'decrease' }}
                                <p><strong>-></strong> Risk is rising. Concussions are increasing for girls, and the gap is closing - it's not just a 'boys' problem' anymore.</p>
                            </div>   
                            <div v-else class="animate-pulse">Loading ...</div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="text-[#86868b] text-sm mt-4">Source: Australian Institute of Health and Welfare (AIHW), Sports
                Injury in
                Australia 2014-24</p>
        </div>
        <!-- Comparison Graph -->
        <div class="bg-white rounded-3xl p-10 shadow-2xl shadow-black/5 border border-[#d2d2d7]/50"
            style="opacity: 1; transform: none;">
            <div class="flex items-start justify-between mb-8">
                <div>
                    <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-users text-[#007aff]"
                            data-fg-dqrj132="33.110:33.18481:/src/app/pages/Data.tsx:382:17:15442:62:e:Users::::::DV8M"
                            data-fgid-dqrj132=":r1a8:">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>Sport Comparison
                    </h3>
                    <p class="text-[#86868b] text-lg">Concussion rate per 100,000 participants AFL highlighted</p>
                </div>
            </div>
            <div class="h-96 mb-8">
                <div class="recharts-responsive-container" style="width: 100%; height: 100%; min-width: 0px;">
                    <div class="flex items-center justify-center font-bold w-full h-full">
                        <Bar :data="sportsComparisonData" :options="compChartOptions" />
                    </div>
                </div>
            </div>
            <div class="space-y-4">
                <div
                    class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-6 border border-[#007aff]/30">
                    <p class="text-[#1d1d1f] text-lg leading-relaxed"><strong class="text-[#007aff]"
                            data-fg-dqrj151="33.110:33.18481:/src/app/pages/Data.tsx:432:17:17460:73:e:strong:t"
                            data-fgid-dqrj151=":r1af:">Contact sports dominate:&nbsp;</strong>
                        <span v-if="topThreeSports.length > 0" class="text-[#1d1d1f] text-lg leading-relaxed">
                        {{ topThreeSports.join(', ')}} have the highest concussion rates per participant. However, all sports carry some
                        concussion risk - from cycling falls to collisions in basketball.
                    </span>
                    <span v-else>
                        <span class="animate-pulse">Loading ...</span>
                    </span>
                    </p>
                </div>
            </div>
            <p class="text-[#86868b] text-sm mt-4">Source: AIHW Sports Injury in Australia 2023-24 AusPlay Participation Data
                2024-25</p>
        </div>
    </div>

</template>

<style scoped></style>