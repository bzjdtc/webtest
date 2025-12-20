<template>
  <div class="music-player-app">
    <div class="player-container">
      <header class="player-header">
        <h1 class="player-title">
          <i class="icon-music"></i>
          网易云风格在线音乐播放器(25216950412)致最最最最最好的老师吴长风        
        </h1>
        <div class="player-controls-top">
          <button class="btn-icon" @click="togglePlayMode" :title="`播放模式: ${playModeText}`">
            <i :class="playModeIcon"></i>
          </button>
          <button class="btn-icon" @click="toggleMiniMode" :title="miniMode ? '展开播放器' : '迷你模式'">
            <i :class="miniMode ? 'icon-expand' : 'icon-minimize'"></i>
          </button>
        </div>
      </header>

      <div class="player-main" :class="{ 'mini-mode': miniMode }">
<div class="player-left" v-show="!miniMode">
          <div class="album-art-container">
            <div class="album-art-wrapper" :class="{ 'playing': isPlaying }">
              <img 
                :src="currentSong.cover" 
                :alt="`${currentSong.title} 专辑封面`" 
                class="album-art"
                @error="handleImageError"
              />
              <div class="album-art-overlay"></div>
            </div>
            
            <div class="song-info">
              <h2 class="song-title">{{ currentSong.title }}</h2>
              <p class="song-artist">{{ currentSong.artist }}</p>
              <p class="song-album">{{ currentSong.album }}</p>
              
              <div class="song-tags">
                <span class="song-tag" v-for="tag in currentSong.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
          
          <div class="controls-container">
            <div class="song-progress">
              <div class="progress-info">
                <span class="current-time">{{ formatTime(currentTime) }}</span>
                <span class="duration">{{ formatTime(currentSong.duration) }}</span>
              </div>
              <div class="progress-bar" @click="seekToTime">
                <div class="progress-track"></div>
                <div 
                  class="progress-fill" 
                  :style="{ width: progressPercentage + '%' }"
                ></div>
                <div 
                  class="progress-handle" 
                  :style="{ left: progressPercentage + '%' }"
                ></div>
              </div>
            </div>

            <div class="playback-controls">
              <button class="btn-control prev" @click="playPrev" title="上一曲">
                <i class="icon-prev"></i>
              </button>
              
              <button class="btn-control play-pause" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
                <i :class="isPlaying ? 'icon-pause' : 'icon-play'"></i>
              </button>
              
              <button class="btn-control next" @click="playNext" title="下一曲">
                <i class="icon-next"></i>
              </button>
              
              <div class="volume-control">
                <button class="btn-icon" @click="toggleMute" :title="isMuted ? '取消静音' : '静音'">
                  <i :class="volumeIcon"></i>
                </button>
                <div class="volume-slider" @click="setVolume">
                  <div class="volume-track"></div>
                  <div 
                    class="volume-fill" 
                    :style="{ width: volume * 100 + '%' }"
                  ></div>
                  <div 
                    class="volume-handle" 
                    :style="{ left: volume * 100 + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="player-right" :class="{ 'full-width': miniMode }">
          
          <div class="lyrics-container" v-if="currentSong.lyricsData && currentSong.lyricsData.length > 0">
            <h3 class="lyrics-title">
              <i class="icon-lyrics"></i>
              歌词
              <span class="auto-scroll-indicator" :class="{ 'active': !isUserScrollingLyrics }">
                {{ isUserScrollingLyrics ? '手动' : '自动' }}
              </span>
              <button 
                class="btn-scroll-reset" 
                @click="resetAutoScroll"
                v-if="isUserScrollingLyrics"
                title="恢复自动滚动"
              >
                恢复
              </button>
            </h3>
            <div 
              class="lyrics-content" 
              ref="lyricsContainer"
              @wheel="handleLyricsWheel"
              @touchstart="handleTouchStart"
            >
              <div 
                v-for="(line, index) in currentSong.lyricsData" 
                :key="index"
                class="lyrics-line"
                :class="{ 'active': isLyricActive(line.time, index) }"
              >
                {{ line.words }}
              </div>
            </div>
          </div>
          <div class="lyrics-placeholder" v-else>
             <i class="icon-music" style="opacity: 0.5; font-size: 48px;"></i>
             <p>暂无歌词</p>
          </div>

          <div class="playlist-container">
            <div class="playlist-header">
              <h3>
                <i class="icon-playlist"></i>
                播放列表 ({{ playlist.length }})
              </h3>
              <div class="playlist-actions">
                <button class="btn-action" @click="shufflePlaylist" title="随机播放列表" :disabled="playlist.length <= 1">
                  <i class="icon-shuffle"></i>
                </button>
              </div>
            </div>
            
            <div class="playlist-content">
              <div class="playlist-scroll">
                <div 
                  v-for="(song, index) in playlist" 
                  :key="song.id"
                  class="playlist-item"
                  :class="{ 
                    'active': currentSong.id === song.id,
                    'playing': currentSong.id === song.id && isPlaying
                  }"
                  @dblclick="playSong(song.id)"
                >
                  <div class="item-index">
                    <span v-if="currentSong.id === song.id && isPlaying" class="playing-indicator">
                      <i class="icon-sound"></i>
                    </span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  
                  <div class="item-info">
                    <div class="item-title">{{ song.title }}</div>
                    <div class="item-artist">{{ song.artist }}</div>
                  </div>
                  
                  <div class="item-duration">{{ formatTime(song.duration) }}</div>
                  
                  <div class="item-actions">
                    <button 
                      class="btn-action-small" 
                      @click="playSong(song.id)"
                    >
                      <i :class="currentSong.id === song.id && isPlaying ? 'icon-pause' : 'icon-play'"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mini-player-bar" v-if="miniMode">
         <div class="mini-album">
          <img 
            :src="currentSong.cover" 
            :alt="`${currentSong.title} 专辑封面`" 
            class="mini-album-art"
            @error="handleImageError"
          />
        </div>
        
        <div class="mini-song-info">
          <div class="mini-song-title">{{ currentSong.title }}</div>
          <div class="mini-song-artist">{{ currentSong.artist }}</div>
        </div>
        
        <div class="mini-controls">
          <button class="btn-mini-control prev" @click="playPrev" title="上一曲">
            <i class="icon-prev"></i>
          </button>
          
          <button class="btn-mini-control play-pause" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
            <i :class="isPlaying ? 'icon-pause' : 'icon-play'"></i>
          </button>
          
          <button class="btn-mini-control next" @click="playNext" title="下一曲">
            <i class="icon-next"></i>
          </button>
        </div>
        
        <div class="mini-progress">
          <div class="mini-progress-bar" @click="seekToTime">
            <div 
              class="mini-progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
        
        <div class="mini-time">
          {{ formatTime(currentTime) }} / {{ formatTime(currentSong.duration) }}
        </div>
        
        <div class="mini-volume">
          <button class="btn-mini-icon" @click="toggleMute">
            <i :class="volumeIcon"></i>
          </button>
        </div>
      </div>
      
      <audio 
        ref="audioElement"
        :src="currentSong.src"
        @timeupdate="updateProgress"
        @ended="handleSongEnded"
        @error="handleAudioError"
      ></audio>
      
      <transition name="fade">
        <div class="playback-toast" v-if="showToast">
          {{ toastMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'

// 响应式数据
const audioElement = ref(null)
const lyricsContainer = ref(null)

// 播放器状态
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const volume = ref(0.7)
const playMode = ref('order')
const miniMode = ref(false)
const lyricsLoading = ref(false)
const lyricsError = ref(false)

// 智能歌词滚动控制 - 修改：增加全局滚动检测
const isUserScrollingLyrics = ref(false)
let userScrollTimeout = null
const touchStartY = ref(0)

// 播放列表和当前歌曲
const playlist = ref([
  {
    id: 1,
    title: '親愛なる世界へ',
    artist: 'Ceui',
    album: '親愛なる世界へ',
    cover: 'http://p1.music.126.net/6FgxJhmAhiruWkjIPu_OmQ==/3434874333355653.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=692641.mp3',
    duration: 319,
    tags: ['J-Pop'],
    lyrics: 'https://meting-api-omega.vercel.app/api?server=netease&type=lrc&id=692641',
    lyricsData: [] // 用于存储解析后的歌词数据
  },
  {
    id: 2,
    title: 'flower',
    artist: '水月陵',
    album: '恋×シンアイ彼女 Complete Sound Track',
    cover: 'http://p2.music.126.net/16zoRqTa4ENff0ktXu90bg==/109951166239755253.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=410446170.mp3',
    duration: 212,
    tags: ['Pure-Music'],
    lyrics: 'https://meting-api-omega.vercel.app/api?server=netease&type=lrc&id=410446170',
    lyricsData: [] // 用于存储解析后的歌词数据
  },
  {
    id: 3,
    title: 'REVIVER',
    artist: 'MY FIRST STORY',
    album: 'ALL LEAD TRACKS',
    cover: 'http://p1.music.126.net/OGUQ9aZmAW-YFkGc1-uLhw==/109951171354110872.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=494642787.mp3',
    duration: 292,
    tags: ['J-Pop'],
    lyrics: 'https://meting-api-omega.vercel.app/api?server=netease&type=lrc&id=494642787',
    lyricsData: [] // 用于存储解析后的歌词数据
  },    
  {
    id: 4,
    title: '瑠璃の鳥',
    artist: '霜月はるか',
    album: '殻ノ少女 オリジナルサウンドトラック',
    cover: 'http://p1.music.126.net/CmgKk9RF8DabNa9qysR-gQ==/109951170965331107.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=28466084.mp3',
    duration: 284,
    tags: ['J-Pop'],
    lyrics: 'https://meting-api-omega.vercel.app/api?server=netease&type=lrc&id=28466084',
    lyricsData: [] // 用于存储解析后的歌词数据
  },
  {
    id: 5,
    title: '空種 -そらたね-',
    artist: '南條愛乃',
    album: '穢翼のユースティア',
    cover: 'http://p1.music.126.net/re_L6v_1cln2EtcMB_JZUw==/4436529418085628.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=630896.mp3',
    duration: 299,
    tags: ['J-Pop'],
    lyrics: 'https://meting-api-omega.vercel.app/api?server=netease&type=lrc&id=630896',
    lyricsData: [] // 用于存储解析后的歌词数据
  }

])

const currentSong = ref(playlist.value[0])

// 提示消息
const showToast = ref(false)
const toastMessage = ref('')

// ========== LRC歌词解析函数 ==========
const parseLRC = (lrcText) => {
  const lines = lrcText.split('\n')
  const lyricList = []
  
  lines.forEach(line => {
    // 匹配LRC时间标签，如 [00:23.990]
    const timeMatches = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/g)
    
    if (timeMatches) {
      const text = line.replace(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/g, '').trim()
      
      // 处理一行歌词可能有多个时间标签的情况
      timeMatches.forEach(timeTag => {
        const match = timeTag.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/)
        if (match) {
          const minutes = parseInt(match[1])
          const seconds = parseInt(match[2])
          const milliseconds = parseInt(match[3].length === 2 ? match[3] * 10 : match[3])
          const totalTime = minutes * 60 + seconds + milliseconds / 1000
          
          lyricList.push({
            time: totalTime,
            words: text
          })
        }
      })
    }
  })
  
  // 按时间点从小到大排序
  lyricList.sort((a, b) => a.time - b.time)
  return lyricList
}

// ========== 获取歌词函数 ==========
const fetchLyrics = async (lyricsUrl) => {
  try {
    lyricsLoading.value = true
    lyricsError.value = false
    
    const response = await fetch(lyricsUrl)
    
    if (!response.ok) {
      throw new Error(`歌词获取失败: ${response.status}`)
    }
    
    const lrcText = await response.text()
    
    // 检查返回内容是否有效
    if (!lrcText || lrcText.includes('Lyric not found') || lrcText.includes('未找到歌词')) {
      console.warn('未找到歌词')
      return []
    }
    
    return parseLRC(lrcText)
  } catch (error) {
    console.error('获取歌词时出错:', error)
    lyricsError.value = true
    return []
  } finally {
    lyricsLoading.value = false
  }
}

// ========== 计算属性 ==========
const progressPercentage = computed(() => {
  if (!currentSong.value || !currentSong.value.duration) return 0
  return (currentTime.value / currentSong.value.duration) * 100
})

const playModeText = computed(() => {
  const modeMap = {
    order: '顺序播放',
    random: '随机播放',
    loop: '单曲循环'
  }
  return modeMap[playMode.value] || modeMap.order
})

const playModeIcon = computed(() => {
  const iconMap = {
    order: 'icon-order',
    random: 'icon-shuffle',
    loop: 'icon-loop'
  }
  return iconMap[playMode.value] || iconMap.order
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'icon-mute'
  if (volume.value > 0.5) return 'icon-volume-high'
  if (volume.value > 0) return 'icon-volume-low'
  return 'icon-volume-off'
})

// ========== 歌词高亮和滚动相关函数 ==========
const isLyricActive = (time, index) => {
  const currentLyricIndex = findCurrentLyricIndex()
  return currentLyricIndex === index
}

const findCurrentLyricIndex = () => {
  if (!currentSong.value.lyricsData || currentSong.value.lyricsData.length === 0) {
    return -1
  }
  
  const lyrics = currentSong.value.lyricsData
  const current = currentTime.value
  
  // 如果当前时间小于第一句歌词的时间，不显示高亮
  if (current < lyrics[0].time) {
    return -1
  }
  
  // 如果当前时间已经超过最后一句歌词的时间，保持最后一句高亮
  if (current >= lyrics[lyrics.length - 1].time) {
    return lyrics.length - 1
  }
  
  // 找到第一句时间大于当前时间的歌词，它的前一句就是当前应该高亮的歌词
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time > current) {
      return i - 1
    }
  }
  
  return -1
}

// ========== 智能歌词滚动控制 - 修改：增加全局滚动监听 ==========
const scrollToCurrentLyric = () => {
  // 如果用户正在手动滚动，暂停自动滚动
  if (isUserScrollingLyrics.value) {
    return
  }
  
  if (!lyricsContainer.value || 
      !currentSong.value.lyricsData || 
      currentSong.value.lyricsData.length === 0) {
    return
  }
  
  const currentLyricIndex = findCurrentLyricIndex()
  
  if (currentLyricIndex >= 0) {
    const lyricElements = lyricsContainer.value.children
    if (lyricElements[currentLyricIndex]) {
      lyricElements[currentLyricIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }
}

// 用户滚动歌词容器时触发 - 修改：添加防抖
const handleLyricsWheel = () => {
  isUserScrollingLyrics.value = true
  resetUserScrollTimeout()
}

// 移动端触摸开始
const handleTouchStart = (event) => {
  touchStartY.value = event.touches[0].clientY
  isUserScrollingLyrics.value = true
  resetUserScrollTimeout()
}

// 重置用户滚动超时的辅助函数 - 修改：增加暂停时间到10秒
const resetUserScrollTimeout = () => {
  if (userScrollTimeout) {
    clearTimeout(userScrollTimeout)
  }
  userScrollTimeout = setTimeout(() => {
    isUserScrollingLyrics.value = false
  }, 10000) // 从5秒增加到10秒
}

// 手动恢复自动滚动的函数
const resetAutoScroll = () => {
  isUserScrollingLyrics.value = false
  // 立即滚动到当前歌词
  nextTick(() => {
    scrollToCurrentLyric()
  })
}

// 全局滚动监听函数 - 新增：监听整个页面的滚动
const handleGlobalScroll = () => {
  if (lyricsContainer.value) {
    isUserScrollingLyrics.value = true
    resetUserScrollTimeout()
  }
}

// 设置歌词滚动监听器 - 修改：增加全局滚动监听
const setupLyricsScrollListener = () => {
  // 监听歌词容器的滚动
  if (lyricsContainer.value) {
    lyricsContainer.value.addEventListener('scroll', () => {
      isUserScrollingLyrics.value = true
      resetUserScrollTimeout()
    })
  }
  
  // 新增：监听整个页面的滚动
  window.addEventListener('scroll', handleGlobalScroll, { passive: true })
}

// ========== 核心播放控制方法 ==========
const togglePlay = () => {
  if (!audioElement.value) return
  
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play().catch(error => {
      console.error('播放失败:', error)
      showToastMessage('播放失败，请检查音频文件')
    })
  }
  
  isPlaying.value = !isPlaying.value
}

const playSong = async (id) => {
  const song = playlist.value.find(s => s.id === id)
  
  if (!song) {
    showToastMessage('未找到歌曲')
    return
  }
  
  // 如果正在播放同一首歌，只是切换播放/暂停
  if (currentSong.value && currentSong.value.id === id) {
    togglePlay()
    return
  }
  
  currentSong.value = song
  currentTime.value = 0
  
  // 异步获取歌词
  if (song.lyrics) {
    try {
      const lyricsData = await fetchLyrics(song.lyrics)
      currentSong.value.lyricsData = lyricsData
    } catch (error) {
      console.warn('歌词加载失败，将继续播放音频:', error)
      currentSong.value.lyricsData = []
    }
  } else {
    currentSong.value.lyricsData = []
  }
  
  // 等待音频元素更新源
  nextTick(() => {
    if (audioElement.value) {
      audioElement.value.load()
      audioElement.value.play()
        .then(() => {
          isPlaying.value = true
          showToastMessage(`正在播放: ${song.title}`)
        })
        .catch(error => {
          console.error('播放失败:', error)
          showToastMessage('播放失败，请检查音频文件')
        })
    }
  })
}

const playPrev = () => {
  if (!currentSong.value) return
  
  const currentIndex = playlist.value.findIndex(s => s.id === currentSong.value.id)
  if (currentIndex === -1) return
  
  let prevIndex
  
  if (playMode.value === 'random') {
    prevIndex = getRandomSongIndex(currentIndex)
  } else {
    prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.value.length - 1
  }
  
  const prevSong = playlist.value[prevIndex]
  if (prevSong) {
    playSong(prevSong.id)
  }
}

const playNext = () => {
  if (!currentSong.value) return
  
  const currentIndex = playlist.value.findIndex(s => s.id === currentSong.value.id)
  if (currentIndex === -1) return
  
  let nextIndex
  
  if (playMode.value === 'random') {
    nextIndex = getRandomSongIndex(currentIndex)
  } else {
    nextIndex = (currentIndex + 1) % playlist.value.length
  }
  
  const nextSong = playlist.value[nextIndex]
  if (nextSong) {
    playSong(nextSong.id)
  }
}

const getRandomSongIndex = (excludeIndex) => {
  if (playlist.value.length <= 1) return 0
  
  let randomIndex
  do {
    randomIndex = Math.floor(Math.random() * playlist.value.length)
  } while (randomIndex === excludeIndex)
  
  return randomIndex
}

const togglePlayMode = () => {
  const modes = ['order', 'random', 'loop']
  const currentIndex = modes.indexOf(playMode.value)
  playMode.value = modes[(currentIndex + 1) % modes.length]
  showToastMessage(`播放模式: ${playModeText.value}`)
}

// ========== 进度控制方法 ==========
const updateProgress = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
    
    // 只在用户没有手动滚动时才执行自动滚动
    if (!isUserScrollingLyrics.value) {
      scrollToCurrentLyric()
    }
  }
}

const seekToTime = (event) => {
  if (!audioElement.value || !currentSong.value || !currentSong.value.duration) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const newTime = percent * currentSong.value.duration
  
  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

// ========== 音量控制方法 ==========
const setVolume = (event) => {
  const volumeSlider = event.currentTarget
  const rect = volumeSlider.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  
  volume.value = Math.max(0, Math.min(1, percent))
  
  if (audioElement.value) {
    audioElement.value.volume = volume.value
    isMuted.value = volume.value === 0
  }
}

const toggleMute = () => {
  if (!audioElement.value) return
  
  isMuted.value = !isMuted.value
  
  if (audioElement.value) {
    audioElement.value.muted = isMuted.value
    if (!isMuted.value && volume.value === 0) {
      volume.value = 0.5
      audioElement.value.volume = 0.5
    }
  }
}

// ========== 播放列表管理方法 ==========
const shufflePlaylist = () => {
  if (playlist.value.length <= 1) return
  
  const shuffled = [...playlist.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  playlist.value = shuffled
  showToastMessage('播放列表已随机排序')
}

// ========== 其他工具方法 ==========
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleSongEnded = () => {
  if (playMode.value === 'loop') {
    // 单曲循环
    if (audioElement.value) {
      audioElement.value.currentTime = 0
      audioElement.value.play()
    }
  } else {
    // 播放下一个
    playNext()
  }
}

const handleImageError = (event) => {
  const img = event.target
  img.src = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
}

const handleAudioError = () => {
  showToastMessage('音频加载失败，请检查网络或音频文件')
  isPlaying.value = false
}

const toggleMiniMode = () => {
  miniMode.value = !miniMode.value
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// ========== 生命周期钩子 - 修改：添加全局滚动监听 ==========
onMounted(() => {
  // 初始化音频元素
  if (audioElement.value) {
    audioElement.value.volume = volume.value
  }
  
  // 从本地存储恢复设置
  const savedVolume = localStorage.getItem('musicPlayerVolume')
  if (savedVolume) {
    const vol = parseFloat(savedVolume)
    if (!isNaN(vol)) {
      volume.value = Math.max(0, Math.min(1, vol))
      if (audioElement.value) {
        audioElement.value.volume = volume.value
      }
    }
  }
  
  const savedPlayMode = localStorage.getItem('musicPlayerPlayMode')
  if (savedPlayMode && ['order', 'random', 'loop'].includes(savedPlayMode)) {
    playMode.value = savedPlayMode
  }
  
  // 设置歌词滚动监听（包括全局监听）
  nextTick(() => {
    setupLyricsScrollListener()
  })
  
  // 预加载第一首歌的歌词
  if (playlist.value[0] && playlist.value[0].lyrics) {
    fetchLyrics(playlist.value[0].lyrics).then(lyricsData => {
      playlist.value[0].lyricsData = lyricsData
    })
  }
})

// 清理函数 - 修改：移除全局滚动监听
onUnmounted(() => {
  if (userScrollTimeout) {
    clearTimeout(userScrollTimeout)
  }
  // 移除全局滚动监听
  window.removeEventListener('scroll', handleGlobalScroll)
})
// ========== 监听状态变化并保存到本地存储 ==========
watch(volume, (newVolume) => {
  localStorage.setItem('musicPlayerVolume', newVolume.toString())
})

watch(playMode, (newMode) => {
  localStorage.setItem('musicPlayerPlayMode', newMode)
})
</script>

<style scoped>
/* 基础样式 */
.music-player-app {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  min-height: 100vh;
  padding: 20px;
}

.player-container {
  max-width: 1100px; /* 稍微调窄一点，看起来更紧凑 */
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  height: 85vh; /* 设定固定总高度，便于内部滚动 */
}
/* 头部样式 */
.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.player-title {
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-controls-top {
  display: flex;
  gap: 15px;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 主内容区域 - 修改为自适应高度 */
.player-main {
  display: flex;
  padding: 30px;
  gap: 30px;
  transition: all 0.3s ease;
  flex: 1; /* 占满剩余空间 */
  overflow: hidden; /* 防止主容器出现滚动条 */
}

.player-main.mini-mode {
  padding-bottom: 80px;
}

/* 左侧区域：专辑 + 控制 */
.player-left {
  flex: 0 0 380px; /* 固定宽度 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto; /* 小屏幕允许滚动 */
}

/* 右侧区域：歌词 + 列表 */
.player-right {
  flex: 1;
  min-width: 0; /* 防止Flex子项溢出 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%; /* 占满高度 */
}

/* 专辑封面区域 */
.album-art-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  /* 不再需要 align-items: center，让内部元素自适应 */
}

.album-art-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1; /* 保持正方形 */
  max-width: 280px;
  margin: 0 auto 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.album-art {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vinyl-record {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #222, #444);
  border-radius: 50%;
  border: 5px solid #000;
  opacity: 0.8;
}

.vinyl-record.spinning {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 歌曲信息 */
.song-info {
  text-align: center;
}

.song-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 1.1rem;
  color: #a0a0ff;
  margin-bottom: 5px;
}

.song-album {
  font-size: 0.95rem;
  color: #aaa;
  margin-bottom: 15px;
}

.song-tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.song-tag {
  background: rgba(160, 160, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #a0a0ff;
}

/* 修改进度条样式 */
.song-progress {
  /* 移除原来的 margin-top: 25px */
  margin-top: 0;
  margin-bottom: 20px; /* 给下方的按钮留出空间 */
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6); /* 稍微调亮一点文字颜色 */
  font-weight: 500;
}

/* 进度条轨道背景 */
.progress-track {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1); /* 确保轨道可见 */
  border-radius: 3px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  padding: 5px 0; /* 增加点击区域 */
  background-clip: content-box;
}

.progress-fill {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 6px;
  background: linear-gradient(90deg, #4a6fff, #a0a0ff);
  border-radius: 3px;
  pointer-events: none;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

/* 歌词区域 */
.lyrics-container {
  flex: 1.2; /* 歌词占稍微多一点空间 */
  min-height: 0; /* 允许 flex 压缩 */
}
.lyrics-placeholder {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  gap: 10px;
}

.lyrics-title {
  padding: 15px 20px;
  font-size: 1.1rem;
  background: rgba(0,0,0,0.1);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0a0ff;
  flex-shrink: 0;
}

.lyrics-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
  /* 移除固定 height: 300px */
  height: auto; 
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
}

.lyrics-line {
  padding: 10px 0; /* 减小行间距 */
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-align: center; /* 歌词居中更好看 */
  border-bottom: none; /* 移除下划线 */
}

.lyrics-line.active {
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  transform: scale(1.05);
  text-shadow: 0 0 15px rgba(160, 160, 255, 0.6);
  padding: 15px 0;
  background: none;
  border: none;
}

/* 确保控制容器布局合理 */
.controls-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px; /* 增加一点内边距 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto; 
  display: flex;
  flex-direction: column; /* 垂直排列：上进度条，下按钮 */
}

.playback-controls {
  display: flex;
  justify-content: space-between; /* 散开排列 */
  align-items: center;
}

.btn-control {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-control:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
}

.btn-control.play-pause {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4a6fff, #a0a0ff);
  box-shadow: 0 5px 15px rgba(74, 111, 255, 0.4);
}

.btn-control.play-pause:hover {
  transform: scale(1.05);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0,0,0,0.2);
  padding: 5px 10px;
  border-radius: 20px;
}

.volume-control .btn-icon {
  width: 30px;
  height: 30px;
  background: transparent;
}

.volume-slider {
  width: 60px; /* 稍微缩短 */
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  padding: 5px 0;
  background-clip: content-box;
}

.volume-fill {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  background: #a0a0ff;
  border-radius: 2px;
  pointer-events: none;
}

.volume-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  opacity: 0; 
  pointer-events: none;
}
.volume-slider:hover .volume-handle { opacity: 1; }

/* 右侧两栏通用布局 */
.lyrics-container, .playlist-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 播放列表 */
.playlist-container {
  flex: 1; /* 播放列表占剩余空间 */
  min-height: 0;
}

.playlist-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.1);
  flex-shrink: 0;
  margin: 0;
}

.playlist-header h3 {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0a0ff;
  margin: 0;
}

.playlist-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.playlist-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.playlist-item.active {
  background: rgba(160, 160, 255, 0.15);
  border-color: rgba(160, 160, 255, 0.3);
  /* 移除左侧粗边框，看起来更现代 */
  border-left: 1px solid rgba(160, 160, 255, 0.3); 
}

.playlist-item.playing .item-title {
  color: #a0a0ff;
}

.item-index {
  width: 30px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.item-info {
  flex: 1;
  min-width: 0;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255,255,255,0.9);
}

.item-artist {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.item-duration {
  width: 60px;
  text-align: right;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  margin-right: 15px;
}
/* 迷你播放器栏 */
.mini-player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1000;
}
.mini-album-art {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.mini-song-info {
  flex: 1;
  min-width: 0;
}

.mini-song-title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-song-artist {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.mini-controls {
  display: flex;
  gap: 15px;
}

.btn-mini-control {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-mini-control.play-pause {
  background: linear-gradient(135deg, #4a6fff, #a0a0ff);
}

.mini-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.mini-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #4a6fff, #a0a0ff);
  border-radius: 2px;
}

.mini-time {
  width: 100px;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.playback-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 25px;
  border-radius: 10px;
  z-index: 1001;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 图标样式 */
[class^="icon-"], [class*=" icon-"] {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-music { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E"); }
.icon-order { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z'/%3E%3C/svg%3E"); }
.icon-shuffle { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z'/%3E%3C/svg%3E"); }
.icon-loop { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z'/%3E%3C/svg%3E"); }
.icon-expand { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z'/%3E%3C/svg%3E"); }
.icon-minimize { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z'/%3E%3C/svg%3E"); }
.icon-play { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E"); }
.icon-pause { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/%3E%3C/svg%3E"); }
.icon-prev { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M6 6h2v12H6zm3.5 6l8.5 6V6z'/%3E%3C/svg%3E"); }
.icon-next { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z'/%3E%3C/svg%3E"); }
.icon-volume-high { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'/%3E%3C/svg%3E"); }
.icon-volume-low { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z'/%3E%3C/svg%3E"); }
.icon-volume-off { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/%3E%3C/svg%3E"); }
.icon-mute { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E"); }
.icon-lyrics { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M14 6l-4-4v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8.17l3-3V6h-1z'/%3E%3C/svg%3E"); }
.icon-playlist { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z'/%3E%3C/svg%3E"); }
.icon-sound { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'/%3E%3C/svg%3E"); }

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(160, 160, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(160, 160, 255, 0.5);
}
</style>