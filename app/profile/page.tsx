/* eslint-disable @next/next/no-img-element */
// app/page.tsx
import { auth } from "@/libs/auth";
import React from "react";

interface ProfileData {
  first_name: string;
  last_name: string;
  image_url: string | null;
  email: string;
  user: string;
  no_of_games_played: number;
  coins: number;
  game_point: number;
}
console.log(process.env.BASE_URL);
export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.userId;
  console.log("profile page", session, "profile page");
  const response = await fetch(`${process.env.BASE_URL}api/profile/${userId}`, {
    cache: "no-store",
  });
  console.log("API Response Status:", response.status);

  if (!response.ok) {
    const error = await response.text();
    console.log("API Error:", error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className=" p-6 rounded-xl shadow-xl border border-red-600/20 backdrop-blur-sm max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <span className="text-red-500 text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Error Loading Profile
          </h2>
          <p className="text-gray-300 mb-6">
            Failed to load profile data. Please try again later or contact
            support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  const { data } = await response.json();
  console.log("Profile Data:", data);

  return (
    <div className="min-h-screen bg-black py-12 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto  rounded-2xl p-8   transform duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image Section with Glass Effect */}
          <div className="flex justify-center md:justify-start">
            {data.image_url ? (
              <div className="relative">
                <img
                  src={data.image_url}
                  alt={`${data.first_name} ${data.last_name}`}
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg transform  transition-transform duration-300 backdrop-blur-sm bg-white/10"
                />
                <div className="absolute -bottom-3 -right-3 bg-green-500 w-6 h-6 rounded-full border-2 border-gray-900 animate-pulse-slow"></div>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center border-4 border-blue-500 shadow-lg backdrop-blur-sm bg-white/10">
                <span className="text-4xl text-white font-bold">
                  {data.first_name[0]}
                  {data.last_name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info Section with Glass Cards */}
          <div className="col-span-2 text-white">
            <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md">
              {`${data.first_name || "_"} ${data.last_name || "_"}`}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-3 rounded-xl hover:bg-gray-800/70 transition-colors border border-gray-700 backdrop-blur-sm  shadow-md hover:shadow-lg">
                <p className="text-gray-400 text-sm font-medium">Email</p>
                <p className="text-white font-semibold mt-1 truncate">
                  {data.email || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-xl hover:bg-gray-800/70 transition-colors border border-gray-700 backdrop-blur-smshadow-md hover:shadow-lg">
                <p className="text-gray-400 text-sm font-medium">
                  Games Played
                </p>
                <p className="text-white font-semibold mt-1">
                  {data.no_of_games_played || 0}
                </p>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl hover:bg-gray-800/70 transition-colors border border-gray-700 backdrop-blur-sm  shadow-md hover:shadow-lg">
                <p className="text-gray-400 text-sm font-medium">Coins</p>
                <p className="text-yellow-400 font-semibold mt-1 flex items-center">
                  <span className="mr-2 text-lg">💰</span>
                  {data.coins || 0}
                </p>
              </div>
              <div className="bg-gray-800/50 p-5 rounded-xl hover:bg-gray-800/70 transition-colors border border-gray-700 backdrop-blur-sm  shadow-md hover:shadow-lg">
                <p className="text-gray-400 text-sm font-medium">Game wons</p>
                <p className="text-yellow-400 font-semibold mt-1 flex items-center">
                  <span className="mr-2 text-lg">🏆</span>
                  {data.won_matches_count || 0}
                </p>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl hover:bg-gray-800/70 transition-colors border border-gray-700 backdrop-blur-smshadow-md hover:shadow-lg sm:col-span-2">
                <p className="text-gray-400 text-sm font-medium">Game Points</p>
                <p className="text-blue-400 font-semibold mt-1 flex items-center">
                  <span className="mr-2 text-lg">⭐</span>
                  {data.game_point || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
