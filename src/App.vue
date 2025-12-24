<template>
  <div class="app-container">
    <header class="header">
      <h1>Horse Racing Game</h1>
      <div class="actions">
        <button @click="generate" class="btn btn-primary" :disabled="isRacing">Generate Program</button>
        <button 
          @click="startRace" 
          class="btn btn-success" 
          :disabled="schedule.length === 0 || isRacing || results.length >= 6"
        >
          {{ results.length >= 6 ? 'Tournament Finished' : 'Start Race' }}
        </button>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar-left">
        <h2>Horse List (1-20)</h2>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Cond.</th> 
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="horse in horses" :key="horse.id">
                <td>{{ horse.name }}</td>
                <td>{{ horse.condition }}</td>
                <td>
                  <div class="color-circle" :style="{ backgroundColor: horse.color }"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </aside>

      <main class="race-track">
        <div class="track-header">
          <h2>Race Track</h2>
          <p v-if="activeRoundData">
            Current: Round {{ activeRoundData.id }} - {{ activeRoundData.distance }}m
          </p>
        </div>

        <div class="lanes-container">
          <div v-if="!activeRoundData" class="track-placeholder">
            Please generate program to see the track lines.
          </div>

          <template v-else>
            <div v-for="(horse, index) in activeRoundData.participants" :key="index" class="lane">
              <div class="lane-number">{{ index + 1 }}</div>
              <div class="track-line">
                <div 
                  class="horse-runner" 
                  :class="{ 'finished': horse.finishTimeFormatted }"
                  :style="{ backgroundColor: horse.color }"
                >
                  <div class="horse-emoji">🐎</div>
                  <div class="horse-name">{{ horse.name }}</div>
                  <div v-if="horse.finishTimeFormatted" class="horse-time">
                    {{ horse.finishTimeFormatted }}s
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </main>

      <aside class="sidebar-right">
        <div class="right-header-group">
          <h2>Schedule</h2>
          <div class="schedule-list">
            <div 
              v-for="round in schedule" 
              :key="round.id" 
              class="schedule-item"
              :class="{ 'active-round': currentRound === round.id - 1 }"
            >
              <span>Round {{ round.id }}</span>
              <span>{{ round.distance }}m</span>
            </div>
          </div>
          <hr />
          <h2>Race Results</h2>
        </div>

        <div class="results-container">
          <div v-if="results.length === 0" class="empty-state">No races finished yet.</div>
          
          <div v-for="(res, index) in results" :key="index" class="result-card">
            <div class="result-header">Round {{ res.round }} - {{ res.distance }}m</div>
            <table class="result-table">
              <thead>
                <tr>
                  <th style="width: 30px;">Pos</th>
                  <th>Name</th>
                  <th style="text-align: right;">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="horse in res.rankings" :key="horse.position">
                  <td class="pos-cell">
                    <span :class="'rank-' + horse.position">{{ horse.position }}</span>
                  </td>
                  <td>{{ horse.name }}</td>
                  <td style="text-align: right;">{{ horse.time }}s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['horses', 'schedule', 'currentRound', 'isRacing', 'results']),
    activeRoundData() {
      return this.schedule[this.currentRound] || null;
    }
  },
  methods: {
    generate() {
      const horseElements = document.querySelectorAll('.horse-runner');
      horseElements.forEach(el => {
        el.style.left = '0%';
        el.classList.remove('finished');
        el.style.transition = 'left 0.1s linear';
      });
      this.$store.dispatch('generateGameData');
    },

    async startRace() {
      if (this.isRacing || !this.activeRoundData || this.results.length >= 6) return;

      this.$store.commit('SET_RACING', true);
      const horseElements = document.querySelectorAll('.horse-runner');
      const startTime = Date.now();
      const raceParticipants = this.activeRoundData.participants;

      const currentDistance = this.activeRoundData.distance;
      const distanceFactor = 1200 / currentDistance; 

      const raceInterval = setInterval(() => {
        let finishedCount = 0;

        raceParticipants.forEach((horse, index) => {
          if (horse.progress >= 100) {
            finishedCount++;
            return;
          }

          let baseSpeed = (horse.condition * 0.01) + Math.random() * 1.2;
          let adjustedSpeed = baseSpeed * distanceFactor;

          horse.progress = Math.min(horse.progress + adjustedSpeed, 100);

          if (horseElements[index]) {
            const offset = (horse.progress / 100) * 75;
            horseElements[index].style.left = `calc(${horse.progress}% - ${offset}px)`;
          }

          if (horse.progress >= 100) {
            horse.finishTimeRaw = Date.now();
            horse.finishTimeFormatted = ((horse.finishTimeRaw - startTime) / 1000).toFixed(2);
          }
        });

        if (finishedCount === raceParticipants.length) {
          clearInterval(raceInterval);
          this.finishRound(raceParticipants);
        }
      }, 50);
    },

    finishRound(finalResults) {
      const sorted = [...finalResults].sort((a, b) => a.finishTimeRaw - b.finishTimeRaw);
      
      const rankings = sorted.map((h, i) => ({
        position: i + 1,
        name: h.name,
        time: h.finishTimeFormatted
      }));

      this.$store.commit('ADD_RESULT', {
        round: this.activeRoundData.id,
        distance: this.activeRoundData.distance,
        rankings: rankings
      });

      this.$store.commit('SET_RACING', false);
      
      setTimeout(() => {
        const winner = rankings[0];
        alert(`Round ${this.activeRoundData.id} Finished! Winner: ${winner.name} (${winner.time}s)`);
        
        if (this.currentRound < 5) {
          this.$store.commit('SET_CURRENT_ROUND', this.currentRound + 1);
          const nextHorses = document.querySelectorAll('.horse-runner');
          nextHorses.forEach(el => {
            el.classList.remove('finished');
            el.style.left = '0%';
          });
        } else {
          alert("Tournament Completed!");
        }
      }, 500);
    }
  } 
} 
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  background-image: url('~@/assets/arkaplan.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.4);
  background-blend-mode: overlay;
}

.header { 
  background: rgba(26, 37, 47, 0.85); 
  color: white; 
  padding: 10px 20px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  height: 60px; 
  box-sizing: border-box;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
}

.main-layout { 
  display: grid; 
  grid-template-columns: 250px 1fr 280px; 
  flex: 1; 
  gap: 15px; 
  padding: 15px; 
  overflow: hidden; 
  height: calc(100vh - 60px); 
}

.sidebar-left, .sidebar-right, .race-track { 
  background: white;
  border-radius: 8px; 
  padding: 15px; 
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
}

.table-wrapper { 
  overflow-y: auto; 
  flex: 1; 
}

.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 12px; 
}

.data-table th, .data-table td { 
  padding: 6px; 
  border-bottom: 1px solid #eee; 
  text-align: left; 
}

.color-circle { 
  width: 12px; 
  height: 12px; 
  border-radius: 50%; 
  border: 1px solid #ccc; 
}

.race-track { 
  background: white !important; 
}

.lanes-container { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  background: #fdfdfd; 
  border-right: 10px double #e74c3c; 
  overflow: hidden; 
}

.lane { 
  display: flex; 
  align-items: center; 
  flex: 1; 
  border-bottom: 1px dashed #eee; 
  position: relative; 
}

.lane-number { 
  width: 30px; 
  height: 100%; 
  background: #34495e; 
  color: white; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: bold; 
  font-size: 12px; 
}

.track-line { 
  flex: 1; 
  position: relative; 
  height: 100%; 
  padding-left: 40px; 
  padding-right: 75px; 
}

.horse-runner { 
  position: absolute; 
  top: 50%; 
  transform: translateY(-50%); 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  width: 75px; 
  height: 50px; 
  border-radius: 6px; 
  z-index: 10; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
  left: 0%; 
  transition: left 0.1s linear; 
}

.finished { 
  transition: none !important; 
}

.horse-emoji { 
  font-size: 18px; 
  line-height: 1; 
}

.horse-name { 
  color: white; 
  font-weight: bold; 
  font-size: 8px; 
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8); 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  max-width: 65px; 
  margin-top: 1px; 
}

.horse-time {
  font-size: 8px; 
  color: #fff; 
  background: rgba(0, 0, 0, 0.6);
  padding: 1px 3px; 
  border-radius: 3px; 
  margin-top: 1px; 
  font-weight: bold;
}

.sidebar-right h2, .sidebar-left h2, .race-track h2 { 
  font-size: 16px; 
  margin-bottom: 10px; 
  margin-top: 0; 
}

.right-header-group { 
  flex-shrink: 0; 
}

.schedule-list { 
  margin-bottom: 10px; 
}

.schedule-item { 
  display: flex; 
  justify-content: space-between; 
  padding: 6px 10px; 
  background: #f8f9fa; 
  margin-bottom: 4px; 
  border-radius: 4px; 
  border-left: 4px solid #3498db; 
  font-size: 12px; 
}

.active-round { 
  border-color: #27ae60 !important; 
  background: #e8f5e9 !important; 
}

.results-container { 
  flex: 1; 
  overflow-y: auto; 
  padding-right: 5px; 
  margin-top: 5px;
}

.result-card { 
  border: 1px solid #eee; 
  border-radius: 6px; 
  margin-bottom: 10px; 
  overflow: hidden; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
}

.result-header { 
  background: #34495e; 
  color: white; 
  padding: 5px; 
  font-size: 11px; 
  font-weight: bold; 
  text-align: center; 
}

.result-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 10px; 
}

.result-table th { 
  background: #ecf0f1; 
  padding: 4px; 
  text-align: left; 
  color: #7f8c8d; 
  font-weight: 600; 
}

.result-table td { 
  padding: 3px 4px; 
  border-bottom: 1px solid #f9f9f9; 
}

.rank-1 { background: #f1c40f; color: white; padding: 1px 5px; border-radius: 8px; font-weight: bold; display: inline-block; min-width: 12px; text-align: center; }
.rank-2 { background: #bdc3c7; color: white; padding: 1px 5px; border-radius: 8px; font-weight: bold; display: inline-block; min-width: 12px; text-align: center; }
.rank-3 { background: #e67e22; color: white; padding: 1px 5px; border-radius: 8px; font-weight: bold; display: inline-block; min-width: 12px; text-align: center; }

.btn { 
  padding: 8px 15px; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  font-weight: bold; 
  transition: 0.3s; 
  font-size: 13px; 
}

.btn-primary { background: #3498db; color: white; }
.btn-success { background: #27ae60; color: white; }
.btn:disabled { background: #bdc3c7; cursor: not-allowed; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #bdc3c7; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #95a5a6; }

.empty-state, .track-placeholder { color: #666; font-weight: normal; text-shadow: none; }
</style>