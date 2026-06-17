import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlineClock, HiOutlineStar } from 'react-icons/hi2';

const TeamOverview = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const { data } = await analyticsService.getAgentPerformance();
      setAgents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load team performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchTeamData} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Team Performance</h1>
        <p className="text-text-secondary">Overview of your support team's productivity and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-card p-6 rounded-2xl border border-border-color shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <HiOutlineUserGroup className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Active Agents</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">{agents.length}</p>
          <p className="text-xs text-green-600 font-bold mt-2">All online</p>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-color shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <HiOutlineCheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Total Resolved</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {agents.reduce((acc, curr) => acc + curr.ticketsResolved, 0)}
          </p>
          <p className="text-xs text-text-secondary mt-2">Past 30 days</p>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-color shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <HiOutlineClock className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Avg. Resolution</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">14.5h</p>
          <p className="text-xs text-green-600 font-bold mt-2">-1.2h from last week</p>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-border-color shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <HiOutlineStar className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Avg. Satisfaction</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">4.6/5</p>
          <p className="text-xs text-text-secondary mt-2">Based on 124 ratings</p>
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl shadow-sm border border-border-color overflow-hidden">
        <div className="p-6 border-b border-border-color">
          <h3 className="font-bold text-text-primary">Agent Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-secondary text-text-secondary text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Resolved</th>
                <th className="px-6 py-4">Avg. Time</th>
                <th className="px-6 py-4">SLA Compliance</th>
                <th className="px-6 py-4">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase text-xs">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-text-primary">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{agent.department}</td>
                  <td className="px-6 py-4 text-sm font-bold text-text-primary">{agent.ticketsResolved}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{agent.avgResolutionHours}h</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[80px] bg-bg-secondary rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${agent.slaCompliance > 90 ? 'bg-green-500' : agent.slaCompliance > 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${agent.slaCompliance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-text-primary">{agent.slaCompliance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-text-primary">{agent.satisfaction}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;
