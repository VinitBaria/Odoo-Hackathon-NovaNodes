import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, ArrowLeft, Share2, User, Calendar, Package, Star, Coins } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { getItemById } = useItems();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Item not found</h1>
        </div>
      </Layout>
    );
  }

  const item = getItemById(id);

  if (!item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Item not found</h1>
          <p className="text-gray-600 mt-2">The item you're looking for doesn't exist.</p>
          <Link to="/browse">
            <Button className="mt-4" variant="eco">Browse Other Items</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSwapRequest = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to request a swap.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Swap request sent!",
      description: "The item owner will be notified of your request.",
    });
  };

  const handlePointsRedemption = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to redeem points.",
        variant: "destructive",
      });
      return;
    }

    if (user.points < 50) {
      toast({
        title: "Insufficient points",
        description: "You need at least 50 points to redeem this item.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Points redeemed!",
      description: "50 points have been deducted. The item owner will be contacted.",
    });
  };

  const isOwner = user?.email === item.userEmail;
  const canInteract = item.status === 'approved' && !isOwner;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/browse" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
          <span>/</span>
          <span>{item.category}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={item.images[selectedImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.title}</h1>
                  <div className="flex items-center gap-4">
                    <Badge variant={item.status === 'approved' ? 'default' : 'secondary'} className="text-sm">
                      {item.status}
                    </Badge>
                    <Badge variant="outline">{item.condition}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">Listed by {item.userEmail.split('@')[0]}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Item Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-800">{item.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium text-gray-800">{item.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-medium text-gray-800">{item.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <p className="font-medium text-gray-800">{item.condition}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            
            <div className="space-y-4">
              {isOwner ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">This is your item</p>
                  <p className="text-blue-600 text-sm">Manage your listings from your dashboard</p>
                </div>
              ) : !user ? (
                <div className="space-y-3">
                  <p className="text-gray-600 text-center">Please log in to interact with this item</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login">
                      <Button className="w-full" variant="eco">Login</Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full" variant="outline">Sign Up</Button>
                    </Link>
                  </div>
                </div>
              ) : canInteract ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      onClick={handleSwapRequest}
                      variant="eco"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Request Swap
                    </Button>
                    <Button 
                      onClick={handlePointsRedemption}
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={user.points < 50}
                    >
                      <Coins className="h-4 w-4" />
                      Redeem (50 points)
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    You have {user.points} points available
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Item not available</p>
                  <p className="text-gray-500 text-sm">
                    This item is {item.status === 'pending' ? 'pending approval' : 'no longer available'}
                  </p>
                </div>
              )}
            </div>

         
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Sustainable Impact
              </h4>
              <p className="text-sm text-green-700">
                By choosing this pre-loved item, you're helping reduce textile waste and supporting circular fashion!
              </p>
            </div>
          </div>
        </div>

     
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">More items from this category</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Related items will be shown here</p>
            <Link to="/browse">
              <Button variant="eco" className="mt-4">Browse All Items</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
