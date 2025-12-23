import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BADGES } from '@/constants/gameRules';
import PlayerBadge from './PlayerBadge';
import { Badge } from '@/types/game.types';

const AVATARS = ['👤', '🧑', '👨', '👩', '🧔', '👱', '🧑‍🦰', '👨‍🦱'];

interface ProfileMenuMobileProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  setUsername: (value: string) => void;
  selectedAvatar: string;
  setSelectedAvatar: (value: string) => void;
  selectedBadge: Badge;
  setSelectedBadge: (badge: Badge) => void;
  maxPlayers: string;
  setMaxPlayers: (value: string) => void;
  timerEnabled: boolean;
  setTimerEnabled: (value: boolean) => void;
  onUpdateProfile: () => void;
  isOffline: boolean;
}

export default function ProfileMenuMobile({
  isOpen,
  onClose,
  username,
  setUsername,
  selectedAvatar,
  setSelectedAvatar,
  selectedBadge,
  setSelectedBadge,
  maxPlayers,
  setMaxPlayers,
  timerEnabled,
  setTimerEnabled,
  onUpdateProfile,
  isOffline,
}: ProfileMenuMobileProps) {
  const handleUpdate = () => {
    onUpdateProfile();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 phone:block hidden"
          />
          
          {/* Menu panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-50 overflow-y-auto phone:block hidden shadow-2xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Configuration</h2>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-white hover:bg-white/10 w-10 h-10 p-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <div className="space-y-6">
                {/* Nombre de joueurs */}
                {!isOffline && (
                  <div>
                    <Label className="text-white mb-2 block">Nombre de joueurs max</Label>
                    <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} joueurs
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Timer */}
                <div className="flex items-center justify-between">
                  <Label className="text-white">Timer activé</Label>
                  <Switch checked={timerEnabled} onCheckedChange={setTimerEnabled} />
                </div>

                {/* Profil */}
                <div className="pt-4 border-t border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Votre profil</h3>

                  <div className="space-y-4">
                    {/* Pseudo */}
                    <div>
                      <Label className="text-white mb-2 block">Pseudo</Label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        maxLength={20}
                      />
                    </div>

                    {/* Avatar */}
                    <div>
                      <Label className="text-white mb-2 block">Avatar</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {AVATARS.map(avatar => (
                          <button
                            key={avatar}
                            onClick={() => setSelectedAvatar(avatar)}
                            className={`text-3xl p-2 rounded-lg transition-all ${
                              selectedAvatar === avatar
                                ? 'bg-blue-500 ring-2 ring-white'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Badge */}
                    <div>
                      <Label className="text-white mb-3 block text-lg font-semibold">Badge</Label>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="grid grid-cols-3 gap-3">
                          {BADGES.slice(0, 9).map(badge => (
                            <motion.button
                              key={badge.id}
                              onClick={() => setSelectedBadge(badge)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                relative group transition-all duration-200
                                ${selectedBadge.id === badge.id
                                  ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-500/50'
                                  : 'hover:ring-2 hover:ring-white/30'}
                                rounded-lg overflow-hidden flex items-center justify-center aspect-square
                              `}
                            >
                              <div className="relative z-10">
                                <PlayerBadge badge={badge} size="md" showTooltip={false} />
                                {selectedBadge.id === badge.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                                  >
                                    ✓
                                  </motion.div>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-0">
                                <span className="text-white text-xs font-semibold px-2 text-center leading-tight">
                                  {badge.title}
                                </span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        
                        {/* Badge sélectionné - Aperçu */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                            <div className="text-3xl flex-shrink-0">{selectedBadge.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-bold mb-1">{selectedBadge.title}</h4>
                              <p className="text-white/70 text-sm line-clamp-2">{selectedBadge.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-white/50 mt-2 text-center">9 premiers badges disponibles</p>
                    </div>

                    <Button
                      onClick={handleUpdate}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Mettre à jour le profil
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
