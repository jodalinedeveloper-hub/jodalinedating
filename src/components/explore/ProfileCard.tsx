import { UserProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Zap } from "lucide-react";
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface ProfileCardProps {
  user: UserProfile;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
}

const SWIPE_THRESHOLD = window.innerWidth / 3;

const ProfileCard = ({ user, onSwipe }: ProfileCardProps) => {
  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { friction: 50, tension: 800 },
  }));

  const handleSwipeAnimation = (direction: 'left' | 'right' | 'super') => {
    const dir = direction === 'left' ? -1 : 1;
    // Animate out
    api.start({
      x: (200 + window.innerWidth) * dir,
      rot: dir * 15,
      config: { friction: 50, tension: 200 },
      onRest: () => onSwipe(direction), // Call onSwipe after animation completes
    });
  };

  const bind = useDrag(({ down, movement: [mx] }) => {
    if (!down && Math.abs(mx) > SWIPE_THRESHOLD) {
      handleSwipeAnimation(mx > 0 ? 'right' : 'left');
    } else {
      api.start({
        x: down ? mx : 0,
        rot: down ? mx / 10 : 0,
        scale: down ? 1.05 : 1,
        config: { friction: 50, tension: down ? 800 : 500 },
      });
    }
  });

  // Opacity for LIKE/NOPE stamps
  const likeOpacity = x.to(x => (x > 0 ? x / (SWIPE_THRESHOLD / 2) : 0));
  const nopeOpacity = x.to(x => (x < 0 ? -x / (SWIPE_THRESHOLD / 2) : 0));

  return (
    <animated.div
      {...bind()}
      style={{ x, scale, rotate: rot, touchAction: 'none' }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <Card className="w-full h-full mx-auto overflow-hidden relative shadow-lg">
        {/* LIKE/NOPE Overlays */}
        <animated.div
          className="absolute top-10 left-4 text-green-500 border-4 border-green-500 rounded-lg px-4 py-1 text-4xl font-bold transform -rotate-12 pointer-events-none"
          style={{ opacity: likeOpacity, zIndex: 1 }}
        >
          LIKE
        </animated.div>
        <animated.div
          className="absolute top-10 right-4 text-red-500 border-4 border-red-500 rounded-lg px-4 py-1 text-4xl font-bold transform rotate-12 pointer-events-none"
          style={{ opacity: nopeOpacity, zIndex: 1 }}
        >
          NOPE
        </animated.div>

        <img
          src={user.photos[0]}
          alt={user.name}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold">
              {user.name}, {user.age}
            </h2>
            <p className="text-base text-gray-200 line-clamp-2">{user.bio}</p>
          </div>
          <div className="flex justify-around items-center mt-6">
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 bg-white/20 backdrop-blur-sm hover:bg-red-500 hover:text-white"
              onClick={() => handleSwipeAnimation('left')}
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-20 h-20 rounded-full border-2 border-accent text-accent bg-white/20 backdrop-blur-sm hover:bg-accent hover:text-white"
              onClick={() => handleSwipeAnimation('right')}
            >
              <Heart className="w-10 h-10" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-2 border-primary text-primary bg-white/20 backdrop-blur-sm hover:bg-primary hover:text-white"
              onClick={() => handleSwipeAnimation('super')}
            >
              <Zap className="w-8 h-8" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </animated.div>
  );
};

export default ProfileCard;