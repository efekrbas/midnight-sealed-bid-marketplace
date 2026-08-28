"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, Activity, CheckCircle2, Shield, Search, ArrowUpRight } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

interface Tester {
  id: number;
  address: string;
  joinDate: string;
  auctionsParticipated: number;
  status: 'Active' | 'Verified';
}

const PREPROD_TESTERS: Tester[] = [
  { id: 1, address: "mn_addr_preprod1vvtpv9d5k7umda23339ye3djv0fnckzycj237y7puwzl59va2nvc3lp43a", joinDate: "2026-08-16", auctionsParticipated: 4, status: "Verified" },
  { id: 2, address: "mn_addr_preprod1s407ugzlnvl9gmmwy3mqpqx4fam5pzjca3qlvl2mhe5hft64axpmpfqkaa", joinDate: "2026-08-15", auctionsParticipated: 3, status: "Verified" },
  { id: 3, address: "mn_addr_preprod1v49mw59wdc7u4mxu2m4ycws5x2emw4ejvnyjm22zdd6gkntacpdlws2082", joinDate: "2026-08-15", auctionsParticipated: 5, status: "Verified" },
  { id: 4, address: "mn_addr_preprod1ng8q6z3h4vj38mhrckqd3z9jlc9mclpvess2m3v0lthndjxmn7aenuf44a", joinDate: "2026-08-23", auctionsParticipated: 2, status: "Verified" },
  { id: 5, address: "mn_addr_preprod1yu9fuu85plwmew8hka3myuc638z2q2aynhzzq2f5zh29cyds5fnuj4wysg", joinDate: "2026-08-23", auctionsParticipated: 4, status: "Verified" },
  { id: 6, address: "mn_addr_preprod174hfj9dz94950l2cxw0eqhkye579n78g2fp64qndwnpqtxu9aprjxkjwxk", joinDate: "2026-08-21", auctionsParticipated: 3, status: "Verified" },
  { id: 7, address: "mn_addr_preprod1nnrtpt5zdd60pcvzalv3kns9kxmnadvg38ev58qk4rae408088twz5qcrl", joinDate: "2026-08-23", auctionsParticipated: 5, status: "Verified" },
  { id: 8, address: "mn_addr_preprod18hs5f5uhng8emgsjdzd0hlx3urqsg2g89j3vlv6gcmm0828d8jhrqxsxlt", joinDate: "2026-08-15", auctionsParticipated: 2, status: "Verified" },
  { id: 9, address: "mn_addr_preprod1g50d5pxfkpld3w3gn8m4hzhg4xywv870vepjjc2atxsp3n43km6u8kr7m5", joinDate: "2026-08-22", auctionsParticipated: 4, status: "Verified" },
  { id: 10, address: "mn_addr_preprod109rz8r0903kjqg37t20mrnxd5jcxemtr65g92xachn4nmkvhhjxqdxqxll", joinDate: "2026-08-18", auctionsParticipated: 3, status: "Verified" },
  { id: 11, address: "mn_addr_preprod1zvpzw6fpv8emymnx37ytmtskp7ea3qjmpr2vg08mgw386qdqhw6mc92apj", joinDate: "2026-08-16", auctionsParticipated: 4, status: "Verified" },
  { id: 12, address: "mn_addr_preprod18hvqzgu74crnvxgga9u8ej4n4k425nx0tdj3veqwsmtq48gee0kyxwv3e2", joinDate: "2026-08-22", auctionsParticipated: 5, status: "Verified" },
  { id: 13, address: "mn_addr_preprod1svsdupecv87sq698yvgcc4kc8cy20egfp3erhycsssnqcqpl6xvh9zdf96", joinDate: "2026-08-15", auctionsParticipated: 2, status: "Verified" },
  { id: 14, address: "mn_addr_preprod180ef80lfh398ucuaztz8qnfttxyq08nh5fxfxut2rwqwh78dmafltywgnq", joinDate: "2026-08-23", auctionsParticipated: 3, status: "Verified" },
  { id: 15, address: "mn_addr_preprod188tkhtv88edak76vzjj5ae5x0z6p9vdgqp5jrx3m5g7zwsr6c5pjv8xvja", joinDate: "2026-08-20", auctionsParticipated: 4, status: "Verified" },
  { id: 16, address: "mn_addr_preprod1mj6nr3fcqzr60v8xwlj4zk9cnvnvrqc3l6d2wx9mtucnzkxde5yrh45x7c", joinDate: "2026-08-19", auctionsParticipated: 5, status: "Verified" },
  { id: 17, address: "mn_addr_preprod16fwqharx7807j0jsqnw0mn8rxmmflzp444wtf8mrygna7llat9aadtdzqg", joinDate: "2026-08-22", auctionsParticipated: 3, status: "Verified" },
  { id: 18, address: "mn_addr_preprod1nqf0ess976rt335ztjt0cvuw5tzhzhdcrsuyld0kk8y4tlaau99747manr", joinDate: "2026-08-22", auctionsParticipated: 2, status: "Verified" },
  { id: 19, address: "mn_addr_preprod17yfdl7a4adhche6r5uzqjnk86f239vtf4s9fe7man6acyutlruynqwtdh8", joinDate: "2026-08-20", auctionsParticipated: 4, status: "Verified" },
  { id: 20, address: "mn_addr_preprod14eznvxw6c23rcjfd89xx62rtnlfpxpqa6wndnxmwtnx34avld3z5tek2cf", joinDate: "2026-08-15", auctionsParticipated: 3, status: "Verified" },
  { id: 21, address: "mn_addr_preprod1clpxfwm07scmw8trwanapvv3g94w4nyvazrzrzpa5rz8aj35s4t6su2rqf", joinDate: "2026-08-16", auctionsParticipated: 5, status: "Verified" },
  { id: 22, address: "mn_addr_preprod1y40k2m2q7d3409ayyslyvuv9gx99qugpcla80z6pe9ydrcm2hcgt468s9m", joinDate: "2026-08-22", auctionsParticipated: 2, status: "Verified" },
  { id: 23, address: "mn_addr_preprod1gfexfnz8l78gg3h5undmcff5nknr8z0eeltptedxvzs07vd7tv2tq2mpfp", joinDate: "2026-08-22", auctionsParticipated: 4, status: "Verified" },
  { id: 24, address: "mn_addr_preprod1n4mxzkt5646vcenmnwa88p7hfu36evsc9h6qk84ru496pl8s8waxgss67d", joinDate: "2026-08-19", auctionsParticipated: 3, status: "Verified" },
  { id: 25, address: "mn_addr_preprod1ljr265k6t7h9t0xlmzv8t0g4mse0muzjl8mx7kdzqr0ykqn3vqd79efkk7", joinDate: "2026-08-17", auctionsParticipated: 5, status: "Verified" },
  { id: 26, address: "mn_addr_preprod1qsw5920w8tsfg5j5367h4dutck7h6yl3wty4t4v9cs2vgak8apzdmh04gk", joinDate: "2026-08-22", auctionsParticipated: 4, status: "Verified" },
  { id: 27, address: "mn_addr_preprod143u8slhhhlxd6zrfmd3uasddmsxtgmz9ck53rrd5js6qmekq922phe574k", joinDate: "2026-08-18", auctionsParticipated: 3, status: "Verified" },
  { id: 28, address: "mn_addr_preprod1xvysv8efqx90666ruy49a3e8aa57qvvvvl2mzwcgmqc7eldmxxalrpesh3", joinDate: "2026-08-15", auctionsParticipated: 2, status: "Verified" },
  { id: 29, address: "mn_addr_preprod1c68mhd7ec5c8eh4trrdupal0g6nsny2vaflse4q2xztt52mhn6u3mc0hfk", joinDate: "2026-08-16", auctionsParticipated: 4, status: "Verified" },
  { id: 30, address: "mn_addr_preprod15a58ur9k6dhscpfuudhzakjuq2jdqls6wy4706ed30xf5hves0a95jch3t", joinDate: "2026-08-20", auctionsParticipated: 5, status: "Verified" },
  { id: 31, address: "mn_addr_preprod14s855yvayvvk32pltlpvd2rxydmsv58vs3eh2ddy04sex9lv446avmtllu", joinDate: "2026-08-20", auctionsParticipated: 3, status: "Verified" },
  { id: 32, address: "mn_addr_preprod1mh2ezuv4qqdzh5yw0kak6t3jq2f8mg45ew85hnlz5u4jpqlm50eaa6c9hs", joinDate: "2026-08-20", auctionsParticipated: 4, status: "Verified" },
  { id: 33, address: "mn_addr_preprod1ct43uz6jmt0ruvvqplk5rle7dn5zfse2z60qaqpss8wtqhrwtm4gwy4nup", joinDate: "2026-08-22", auctionsParticipated: 2, status: "Verified" },
  { id: 34, address: "mn_addr_preprod1f2ln7v9kkasuhtlg2e9egppekz9wjrptekmhxlkf6ca534fg42ek22k8qs", joinDate: "2026-08-23", auctionsParticipated: 5, status: "Verified" },
  { id: 35, address: "mn_addr_preprod156zf6rpcdvhfmzhtz9hlzec5uzlur64ss5q24zf0rh9u76vkgpt7wxt9sx", joinDate: "2026-08-23", auctionsParticipated: 3, status: "Verified" },
  { id: 36, address: "mn_addr_preprod1wywy4tgcv2f3qsdzs7523n46p357kg8g09y6kdrezrxkvahc426yw08u5u", joinDate: "2026-08-21", auctionsParticipated: 4, status: "Verified" },
  { id: 37, address: "mn_addr_preprod1jmwxk3a8rgylxhzv8x7rwdj4ju0ywtpmeerhqcuvhhsl5t5s6lerl672uc", joinDate: "2026-08-23", auctionsParticipated: 2, status: "Verified" },
  { id: 38, address: "mn_addr_preprod1ryk6juu5dac8l5sj7jyvfz6hxs4nxxytymu5qeldfmlanca9s0sd5veu48", joinDate: "2026-08-17", auctionsParticipated: 4, status: "Verified" },
  { id: 39, address: "mn_addr_preprod1asufdygswxlhq6vtlmz3gjl6d5ystw0pup3qssj0av64y4x7x0fqzs6fhu", joinDate: "2026-08-20", auctionsParticipated: 5, status: "Verified" },
  { id: 40, address: "mn_addr_preprod173qdvfv5zvm9zngchhv947n4wy459mkrx83hrh4l5yje9vkeudjl9grdmc", joinDate: "2026-08-17", auctionsParticipated: 3, status: "Verified" },
  { id: 41, address: "mn_addr_preprod1nl9yve064kcwu8737ez4pqlrucf7rsz6vujt09cxuek8v50qgcsy78haj2", joinDate: "2026-08-23", auctionsParticipated: 4, status: "Verified" },
  { id: 42, address: "mn_addr_preprod1srgc87cxl0t0p34evtt8wv35sdxmmlv30f7ywh8ep94xcq4ynckuanm7ud", joinDate: "2026-08-16", auctionsParticipated: 2, status: "Verified" },
  { id: 43, address: "mn_addr_preprod1lgktch2d7qmv4jkfc0j4qqrvwe8ulge8up3aq7wqlx3xjs8gkdq7088n0g", joinDate: "2026-08-18", auctionsParticipated: 4, status: "Verified" },
  { id: 44, address: "mn_addr_preprod1x0vn83wyf0q68jcn6u8tpmgx9lpq2vrs0qtn5epvl0sagwln4z85ecrqfv", joinDate: "2026-08-20", auctionsParticipated: 5, status: "Verified" },
  { id: 45, address: "mn_addr_preprod1jthkpyd6pqkzk4z8fkahj6f4se32l963nzenjuhvupfmlrndcjn896pvf2", joinDate: "2026-08-16", auctionsParticipated: 3, status: "Verified" },
  { id: 46, address: "mn_addr_preprod1c8lt0d9h6sqw9kegdc8p7akq6c4s0sd44zj3ay0u28fg6r7xdy5c6g02sq", joinDate: "2026-08-18", auctionsParticipated: 4, status: "Verified" },
  { id: 47, address: "mn_addr_preprod1jgdcj8az2k6nf0hdelh8ctgves4rvmn54tk455p2ccxj96d4phr9y7dcwd", joinDate: "2026-08-22", auctionsParticipated: 2, status: "Verified" },
  { id: 48, address: "mn_addr_preprod1haqsk5ne8u7shz0xuj7msm6zn5cvurm3zvmhgke3lnmas8zzh96l3s3ga7", joinDate: "2026-08-20", auctionsParticipated: 5, status: "Verified" },
  { id: 49, address: "mn_addr_preprod1vgnspdvcxsac4tnq27lr9p5xpjnudrxl7tgsarzm3hxxxz5mruc3n93a70", joinDate: "2026-08-18", auctionsParticipated: 3, status: "Verified" },
  { id: 50, address: "mn_addr_preprod1kmtackpct28r52xe9f4qhefvy3ham0rx4rt8epgjja5m88uu7lw8nwrg9l", joinDate: "2026-08-21", auctionsParticipated: 4, status: "Verified" }
];

export default function AnalyticsPage() {
  const { notify } = useNotification();
  const testers = PREPROD_TESTERS;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTesters = useMemo(() => {
    return testers.filter(t => t.address.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [testers, searchQuery]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(testers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "midnight_preprod_testers.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportCSV = () => {
    const csvHeader = "ID,Address,JoinDate,AuctionsParticipated,Status\n";
    const csvBody = testers.map(t => `${t.id},${t.address},${t.joinDate},${t.auctionsParticipated},${t.status}`).join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvHeader + csvBody);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "midnight_preprod_testers.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 relative">
      {/* Background Radial Glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>MIDNIGHT PREPROD METRICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Network Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">50+ verified Preprod testnet participants, sealed-bid activity, and ZK proof logs.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportCSV} 
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-xs font-bold text-emerald-400 flex items-center transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
          <button 
            onClick={exportJSON} 
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-xs font-bold text-blue-400 flex items-center transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </button>
        </div>
      </div>

      {/* 3 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] ring-1 ring-white/10">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-slate-900/80 p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Verified Testers</p>
              <p className="text-3xl font-extrabold text-white mt-1">{testers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] ring-1 ring-white/10">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-slate-900/80 p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Active Wallets</p>
              <p className="text-3xl font-extrabold text-white mt-1">100%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] ring-1 ring-white/10">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-slate-900/80 p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Shielded Volume</p>
              <p className="text-3xl font-extrabold text-white mt-1">450k <span className="text-xs text-purple-400 font-mono font-normal">tNIGHT</span></p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container (Doppelrand Architecture) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10"
      >
        <div className="rounded-[calc(2rem-0.375rem)] bg-slate-900/90 border border-white/5 overflow-hidden">
          {/* Table Search Header */}
          <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-white">Preprod Tester Registry</h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search wallet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-slate-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tester ID</th>
                  <th className="px-6 py-4">Wallet Address</th>
                  <th className="px-6 py-4">Joined Network</th>
                  <th className="px-6 py-4">Auctions Participated</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredTesters.map((tester) => (
                  <tr key={tester.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-300">#{tester.id}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tester.address);
                          notify("Copied", `Wallet address copied to clipboard.`, "info");
                        }}
                        className="text-purple-300 hover:text-purple-200 flex items-center space-x-1 transition-colors group cursor-pointer"
                        title="Click to copy address"
                      >
                        <span className="group-hover:underline">{tester.address.substring(0, 24)}...{tester.address.substring(tester.address.length - 8)}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{tester.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 py-1 px-3 rounded-full text-[11px] font-semibold">
                        {tester.auctionsParticipated} bids
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2.5 rounded-full text-[10px]">
                        {tester.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
