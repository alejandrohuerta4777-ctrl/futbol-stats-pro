require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE = 'https://v3.football.api-sports.io';
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

async function football(pathname, params = {}) {
  if (!API_KEY || API_KEY === 'PEGA_AQUI_TU_API_KEY') {
    const e = new Error('Falta configurar API_FOOTBALL_KEY en el archivo .env'); e.status = 503; throw e;
  }
  const url = new URL(BASE + pathname);
  Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v); });
  const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
  const data = await response.json();
  if (!response.ok || data.errors && Object.keys(data.errors).length) throw new Error(JSON.stringify(data.errors || data));
  return data.response || [];
}
app.get('/api/status', (req,res) => res.json({configured: !!API_KEY && API_KEY !== 'PEGA_AQUI_TU_API_KEY'}));
app.get('/api/leagues', async (req,res) => { try { res.json(await football('/leagues', {season: req.query.season || new Date().getFullYear()})); } catch(e) { res.status(e.status || 500).json({error:e.message}); } });
app.get('/api/fixtures', async (req,res) => { try { res.json(await football('/fixtures', {date:req.query.date || new Date().toISOString().slice(0,10), league:req.query.league, season:req.query.season, live:req.query.live})); } catch(e) { res.status(e.status || 500).json({error:e.message}); } });
app.get('/api/team-search', async (req,res) => { try { res.json(await football('/teams', {search:req.query.q, league:req.query.league, season:req.query.season || new Date().getFullYear()})); } catch(e) { res.status(e.status || 500).json({error:e.message}); } });
app.get('/api/team/:id/recent', async (req,res) => { try { res.json(await football('/fixtures', {team:req.params.id, last:5, status:'FT'})); } catch(e) { res.status(e.status || 500).json({error:e.message}); } });
app.get('/api/fixture/:id/stats', async (req,res) => { try { const [stats, prediction] = await Promise.all([football('/fixtures/statistics',{fixture:req.params.id}), football('/predictions',{fixture:req.params.id}).catch(()=>[])]); res.json({stats,prediction}); } catch(e) { res.status(e.status || 500).json({error:e.message}); } });
app.get('/api/team/:id/next', async (req,res) => { try { res.json(await football('/fixtures', {team:req.params.id, next:1})); } catch(e) { res.status(e.status || 500).json({error:e.message}); } });
app.get('/api/head-to-head', async (req,res) => { try { res.json(await football('/fixtures/headtohead',{h2h:`${req.query.home}-${req.query.away}`,last:5})); } catch(e) { res.status(e.status || 500).json({error:e.message}); } });
app.use((err,req,res,next)=>res.status(500).json({error:err.message}));
app.listen(PORT,()=>console.log(`Fútbol Stats Pro listo en http://localhost:${PORT}`));
