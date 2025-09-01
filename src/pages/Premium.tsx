import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Eye, Heart, Rocket, Star, Zap } from "lucide-react";

const premiumFeatures = [
  {
    icon: Heart,
    title: "Unlimited Likes",
    description: "Swipe right as much as you want.",
  },
  {
    icon: Eye,
    title: "See Who Likes You",
    description: "Match instantly with people who have already liked you.",
  },
  {
    icon: Zap,
    title: "5 Free Super Likes a Week",
    description: "Stand out from the crowd and get noticed faster.",
  },
  {
    icon: Rocket,
    title: "1 Free Profile Boost a Month",
    description: "Be one of the top profiles in your area for 30 minutes.",
  },
];

const Premium = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-block bg-primary/10 p-3 rounded-full">
          <Star className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Jodaline Premium
        </h1>
        <p className="text-lg text-muted-foreground">
          Upgrade your experience and get the most out of Jodaline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        {premiumFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>1 Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">KES 1,000</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose Plan</Button>
          </CardFooter>
        </Card>
        <Card className="border-primary relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
            Popular
          </Badge>
          <CardHeader>
            <CardTitle>6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">KES 4,800</p>
            <p className="text-sm text-muted-foreground">KES 800 per month</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose Plan</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>12 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">KES 7,200</p>
            <p className="text-sm text-muted-foreground">KES 600 per month</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose Plan</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Premium;