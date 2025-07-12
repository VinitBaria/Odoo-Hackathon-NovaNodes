import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, Package, ArrowRightLeft, Star, TrendingUp, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useItems } from "@/hooks/useItems";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserItems } = useItems();
  
  if (!user) {
    return null; 
  }
  
  const userItems = getUserItems(user.email);
  const pendingItems = userItems.filter(item => item.status === 'pending');
  const approvedItems = userItems.filter(item => item.status === 'approved');
  const unavailableItems = userItems.filter(item => item.status === 'unavailable');

  
  const mockSwaps = [
    {
      id: '1',
      itemTitle: 'Vintage Denim Jacket',
      requesterEmail: 'jane@example.com',
      status: 'pending',
      type: 'incoming'
    },
    {
      id: '2', 
      itemTitle: 'Elegant Evening Dress',
      ownerEmail: 'john@example.com',
      status: 'accepted',
      type: 'outgoing'
    }
  ];

  const pointsToNextLevel = 250;
  const pointsProgress = (user.points / pointsToNextLevel) * 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user.email.split('@')[0]}!</h1>
          <p className="text-xl text-gray-600">Here's what's happening with your sustainable fashion journey</p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-eco text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Points Balance</CardTitle>
                <Star className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{user.points}</div>
              <div className="text-sm opacity-90">
                {pointsToNextLevel - user.points} to next level
              </div>
              <Progress value={pointsProgress} className="mt-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Items Listed</CardTitle>
                <Package className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{userItems.length}</div>
              <div className="text-sm text-gray-600">{approvedItems.length} approved</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Swaps</CardTitle>
                <ArrowRightLeft className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{mockSwaps.length}</div>
              <div className="text-sm text-gray-600">1 pending review</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Impact Score</CardTitle>
                <Award className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">850</div>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% this month
              </div>
            </CardContent>
          </Card>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/add-item">
            <Card className="hover:shadow-eco transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="bg-gradient-eco rounded-full p-3 mr-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">List New Item</h3>
                  <p className="text-sm text-gray-600">Add clothing to your collection</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/browse">
            <Card className="hover:shadow-eco transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="bg-gradient-nature rounded-full p-3 mr-4">
                  <Package className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Browse Items</h3>
                  <p className="text-sm text-gray-600">Find items to swap</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-eco transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <CardContent className="flex items-center p-6">
              <div className="bg-gradient-eco rounded-full p-3 mr-4">
                <ArrowRightLeft className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Manage Swaps</h3>
                <p className="text-sm text-gray-600">View active exchanges</p>
              </div>
            </CardContent>
          </Card>
        </div>

       
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">My Items</TabsTrigger>
            <TabsTrigger value="swaps">Swaps</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

         
          <TabsContent value="items" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Your Items</h2>
              <Link to="/add-item">
                <Button variant="eco">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            </div>

            {userItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No items yet</h3>
                  <p className="text-gray-500 mb-6">Start your sustainable fashion journey by listing your first item!</p>
                  <Link to="/add-item">
                    <Button variant="eco">List Your First Item</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-eco transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                        <Badge 
                          variant={item.status === 'approved' ? 'default' : item.status === 'pending' ? 'secondary' : 'outline'}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          <Badge variant="outline" className="text-xs">{item.size}</Badge>
                        </div>
                        <Link to={`/item/${item.id}`}>
                          <Button variant="eco" size="sm">View</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

         
          <TabsContent value="swaps" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Swaps</h2>
            
            <div className="space-y-4">
              {mockSwaps.map((swap) => (
                <Card key={swap.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{swap.itemTitle}</h3>
                        <p className="text-sm text-gray-600">
                          {swap.type === 'incoming' ? `Request from ${swap.requesterEmail}` : `Your request to ${swap.ownerEmail}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={swap.status === 'accepted' ? 'default' : 'secondary'}>
                          {swap.status}
                        </Badge>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {mockSwaps.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <ArrowRightLeft className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No swaps yet</h3>
                    <p className="text-gray-500 mb-6">Start browsing items to find something you'd like to swap for!</p>
                    <Link to="/browse">
                      <Button variant="eco">Browse Items</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

       
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-2">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">You earned 50 points for listing "Vintage Denim Jacket"</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-2">
                      <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">New swap request received for "Evening Dress"</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-2">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">You reached Level 2! Welcome bonus: 25 points</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
