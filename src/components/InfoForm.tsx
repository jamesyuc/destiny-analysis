import React, { useState } from 'react';
import clsx from 'clsx';
import { UserProfile } from '@/types';

// Premium Mystic/Cyberpunk styling - single line for Tailwind compatibility
const styles = {
    container: "relative max-w-lg mx-auto p-10 bg-gradient-to-b from-black/80 via-slate-900/60 to-black/80 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.15)]",
    innerGlow: "absolute inset-0 rounded-2xl bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none",
    title: "relative text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-4 text-center tracking-[0.3em] font-bold",
    subtitle: "text-center text-amber-500/60 text-xs tracking-[0.5em] uppercase mb-8",
    formGroup: "mb-8 relative z-10",
    label: "block text-sm text-amber-300/70 mb-3 font-serif tracking-[0.2em] uppercase",
    input: "w-full bg-black/60 border-2 border-amber-500/20 rounded-xl px-5 py-4 text-amber-100 text-lg tracking-wider focus:outline-none focus:border-amber-400/60 focus:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 placeholder-amber-900/50 hover:border-amber-500/40",
    select: "w-full bg-black/60 border-2 border-amber-500/20 rounded-xl px-5 py-4 text-amber-100 text-lg tracking-wider focus:outline-none focus:border-amber-400/60 focus:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 appearance-none cursor-pointer hover:border-amber-500/40",
    button: "relative w-full py-5 rounded-xl font-serif text-xl tracking-[0.3em] uppercase bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black font-bold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden"
};

interface InfoFormProps {
    onSubmit: (profile: UserProfile) => void;
}

export const InfoForm: React.FC<InfoFormProps> = ({ onSubmit }) => {
    const [profile, setProfile] = useState<UserProfile>({
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        birthHour: '',
        gender: 'male'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile.birthYear || !profile.birthMonth || !profile.birthDay) return; // Simple validation
        onSubmit(profile);
    };

    return (
        <div
            className="relative w-full max-w-2xl mx-auto p-8 md:p-12 rounded-2xl border"
            style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(15,23,42,0.6), rgba(0,0,0,0.85))',
                borderColor: 'rgba(245,158,11,0.4)',
                boxShadow: '0 0 80px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
            }}
        >
            {/* Inner glow overlay */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(245,158,11,0.05), transparent)' }} />

            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-400/60" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400/60" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-400/60" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-400/60" />

            <h2
                className="text-3xl font-serif mb-2 text-center tracking-widest font-bold"
                style={{
                    background: 'linear-gradient(to right, #fde68a, #f59e0b, #fde68a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(245,158,11,0.5)'
                }}
            >
                命盘开启
            </h2>
            <p className="text-center text-amber-500/60 text-xs tracking-widest uppercase mb-8">· 天机推演 ·</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-8 relative z-10">
                    <label className="block text-sm text-amber-300/80 mb-3 font-serif tracking-widest uppercase">性别 / Gender</label>
                    <div className="flex justify-center gap-8 py-4">
                        {/* Male Tablet (乾造) */}
                        <div
                            onClick={() => setProfile({ ...profile, gender: 'male' })}
                            className={clsx(
                                "relative w-24 h-32 rounded-lg border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-xl group overflow-hidden",
                                profile.gender === 'male'
                                    ? "bg-amber-700/90 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-105"
                                    : "bg-black/60 border-white/10 hover:border-white/30 grayscale opacity-70"
                            )}
                        >
                            <div className={clsx(
                                "text-2xl font-serif writing-vertical-rl font-bold tracking-widest z-10",
                                profile.gender === 'male' ? "text-amber-100" : "text-gray-500"
                            )}>
                                乾造
                            </div>
                            <div className={clsx(
                                "text-[10px] uppercase tracking-wider font-sans opacity-60 z-10",
                                profile.gender === 'male' ? "text-amber-200" : "text-gray-600"
                            )}>
                                MALE
                            </div>

                            {/* Active Indicator Ring */}
                            {profile.gender === 'male' && (
                                <div className="absolute inset-0 border-[3px] border-amber-300/50 rounded-lg animate-pulse" />
                            )}
                        </div>

                        {/* Female Tablet (坤造) */}
                        <div
                            onClick={() => setProfile({ ...profile, gender: 'female' })}
                            className={clsx(
                                "relative w-24 h-32 rounded-lg border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-xl group overflow-hidden",
                                profile.gender === 'female'
                                    ? "bg-amber-700/90 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-105"
                                    : "bg-black/60 border-white/10 hover:border-white/30 grayscale opacity-70"
                            )}
                        >
                            <div className={clsx(
                                "text-2xl font-serif writing-vertical-rl font-bold tracking-widest z-10",
                                profile.gender === 'female' ? "text-amber-100" : "text-gray-500"
                            )}>
                                坤造
                            </div>
                            <div className={clsx(
                                "text-[10px] uppercase tracking-wider font-sans opacity-60 z-10",
                                profile.gender === 'female' ? "text-amber-200" : "text-gray-600"
                            )}>
                                FEMALE
                            </div>

                            {/* Active Indicator Ring */}
                            {profile.gender === 'female' && (
                                <div className="absolute inset-0 border-[3px] border-amber-300/50 rounded-lg animate-pulse" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Date & Time Grid - side by side */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 'none', position: 'relative', zIndex: 10 }}>
                        <label className="block text-sm text-amber-300/80 mb-3 font-serif tracking-widest uppercase">出生日期 / Date of Birth</label>
                        <div className="flex items-center gap-2">
                            {/* Year input */}
                            <input
                                type="text"
                                placeholder="年"
                                maxLength={4}
                                className="w-16 bg-black/70 rounded-lg px-2 py-4 text-amber-100 text-lg tracking-wider text-center focus:outline-none focus:border-amber-400/60 transition-all duration-300"
                                style={{
                                    border: '2px solid rgba(245,158,11,0.3)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                }}
                                value={profile.birthYear}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setProfile({ ...profile, birthYear: val });
                                }}
                            />
                            <span className="text-amber-500/50">-</span>
                            {/* Month input */}
                            <input
                                type="text"
                                placeholder="月"
                                maxLength={2}
                                className="w-12 bg-black/70 rounded-lg px-2 py-4 text-amber-100 text-lg tracking-wider text-center focus:outline-none focus:border-amber-400/60 transition-all duration-300"
                                style={{
                                    border: '2px solid rgba(245,158,11,0.3)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                }}
                                value={profile.birthMonth}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                    setProfile({ ...profile, birthMonth: val });
                                }}
                                onBlur={(e) => {
                                    const val = e.target.value;
                                    if (val && val.length === 1) {
                                        setProfile({ ...profile, birthMonth: val.padStart(2, '0') });
                                    }
                                }}
                            />
                            <span className="text-amber-500/50">-</span>
                            {/* Day input */}
                            <input
                                type="text"
                                placeholder="日"
                                maxLength={2}
                                className="w-12 bg-black/70 rounded-lg px-2 py-4 text-amber-100 text-lg tracking-wider text-center focus:outline-none focus:border-amber-400/60 transition-all duration-300"
                                style={{
                                    border: '2px solid rgba(245,158,11,0.3)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                }}
                                value={profile.birthDay}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                    setProfile({ ...profile, birthDay: val });
                                }}
                                onBlur={(e) => {
                                    const val = e.target.value;
                                    if (val && val.length === 1) {
                                        setProfile({ ...profile, birthDay: val.padStart(2, '0') });
                                    }
                                }}
                            />
                            {/* Calendar button */}
                            <div className="relative">
                                <input
                                    type="date"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const dateVal = e.target.value;
                                        if (dateVal) {
                                            const [y, m, d] = dateVal.split('-');
                                            setProfile({ ...profile, birthYear: y, birthMonth: m, birthDay: d });
                                        }
                                    }}
                                    value={profile.birthYear && profile.birthMonth && profile.birthDay ? `${profile.birthYear}-${profile.birthMonth}-${profile.birthDay}` : ''}
                                />
                                <button
                                    type="button"
                                    className="w-12 h-12 bg-black/70 rounded-lg flex items-center justify-center cursor-pointer hover:bg-amber-500/20 transition-colors"
                                    style={{
                                        border: '2px solid rgba(245,158,11,0.3)'
                                    }}
                                    onClick={(e) => {
                                        const container = e.currentTarget.parentElement;
                                        const dateInput = container?.querySelector('input[type="date"]') as HTMLInputElement;
                                        if (dateInput) {
                                            try {
                                                dateInput.showPicker();
                                            } catch {
                                                dateInput.click();
                                            }
                                        }
                                    }}
                                >
                                    <span className="text-amber-500/80 text-xl">📅</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px', position: 'relative', zIndex: 10 }}>
                        <label className="block text-sm text-amber-300/80 mb-3 font-serif tracking-widest uppercase">出生时辰 / Time</label>
                        <select
                            className="w-full bg-black/70 rounded-xl px-5 py-4 text-amber-100 text-lg tracking-wider appearance-none cursor-pointer focus:outline-none"
                            style={{
                                border: '2px solid rgba(245,158,11,0.3)',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                            }}
                            value={profile.birthHour}
                            onChange={e => setProfile({ ...profile, birthHour: e.target.value })}
                        >
                            <option value="">未知 / 不确定</option>
                            <option value="0">子时 (23:00 - 00:59)</option>
                            <option value="1">丑时 (01:00 - 02:59)</option>
                            <option value="3">寅时 (03:00 - 04:59)</option>
                            <option value="5">卯时 (05:00 - 06:59)</option>
                            <option value="7">辰时 (07:00 - 08:59)</option>
                            <option value="9">巳时 (09:00 - 10:59)</option>
                            <option value="11">午时 (11:00 - 12:59)</option>
                            <option value="13">未时 (13:00 - 14:59)</option>
                            <option value="15">申时 (15:00 - 16:59)</option>
                            <option value="17">酉时 (17:00 - 18:59)</option>
                            <option value="19">戌时 (19:00 - 20:59)</option>
                            <option value="21">亥时 (21:00 - 22:59)</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-5 rounded-xl font-serif text-xl tracking-widest uppercase text-black font-bold transform hover:scale-105 active:scale-95 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(to right, #d97706, #f59e0b, #d97706)',
                        boxShadow: '0 0 40px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                    }}
                >
                    开始推演
                </button>
            </form>
        </div>
    );
};
