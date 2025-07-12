import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recycle, Heart, Users, ArrowRight, Leaf, Star } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const { getFeaturedItems } = useItems();
  const { user } = useAuth();
  const featuredItems = getFeaturedItems();

  return (
    <Layout>

      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Welcome to <span className="text-eco-light">ReWear</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto">
              Join the sustainable fashion movement. Swap, share, and reduce textile waste with our community-driven clothing exchange platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link to="/browse">
                <Button variant="eco" size="xl" className="w-full sm:w-auto">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="nature" size="xl" className="w-full sm:w-auto">
                  Browse Items
                </Button>
              </Link>
              <Link to={user ? "/add-item" : "/signup"}>
                <Button variant="eco" size="xl" className="w-full sm:w-auto">
                  List an Item
                </Button>

              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose ReWear?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Making sustainable fashion accessible, affordable, and fun for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-eco transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="pt-6">
                <div className="bg-gradient-eco rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Recycle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Sustainable Impact</h3>
                <p className="text-gray-600">
                  Reduce textile waste and environmental impact by giving clothes a second life through our exchange platform.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-eco transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="pt-6">
                <div className="bg-gradient-eco rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Community Driven</h3>
                <p className="text-gray-600">
                  Connect with like-minded individuals who share your passion for sustainable fashion and ethical consumption.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-eco transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="pt-6">
                <div className="bg-gradient-eco rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Easy Exchange</h3>
                <p className="text-gray-600">
                  Simple swap system with points-based redemption. Get new-to-you clothes without spending money.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Items</h2>
            <p className="text-xl text-gray-600">
              Discover amazing pre-loved fashion pieces from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-eco transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                    <Badge variant="secondary" className="ml-2">
                      {item.condition}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge variant="outline">{item.size}</Badge>
                    </div>
                    <Link to={`/item/${item.id}`}>
                      <Button variant="eco" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button variant="eco" size="lg">
                Browse All Items
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

   
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-green-200">Items Exchanged</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-200">Happy Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500kg</div>
              <div className="text-green-200">Textile Waste Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Start Your Sustainable Fashion Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of fashion lovers making a positive impact on the environment, one swap at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? "/add-item" : "/signup"}>
                <Button variant="eco" size="xl">
                  <Leaf className="mr-2 h-5 w-5" />
                  {user ? "List Your First Item" : "Join ReWear Today"}
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="xl">
                  Explore the Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
