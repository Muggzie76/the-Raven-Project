import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor RavenWebsite {
    // Types
    type BlogPost = {
        id: Nat;
        title: Text;
        content: Text;
        author: Principal;
        date: Int;
        imageUrl: ?Text;
    };

    type Admin = {
        principal: Principal;
        role: Text; // "master" or "editor"
    };

    // State
    private stable var nextPostId: Nat = 0;
    private var blogPosts = HashMap.HashMap<Nat, BlogPost>(0, Nat.equal, Hash.hash);
    private var admins = HashMap.HashMap<Principal, Admin>(0, Principal.equal, Principal.hash);

    // Token price tracking
    private stable var lastTokenPrice: Float = 0.0;
    private stable var lastUpdateTime: Int = 0;

    // Initialize with master admin
    public func init(principal: Principal) : async () {
        admins.put(principal, {
            principal = principal;
            role = "master";
        });
    };

    // Blog post management
    public shared(msg) func createPost(title: Text, content: Text, imageUrl: ?Text) : async Nat {
        let isUserAdmin = await isAdmin(msg.caller);
        assert(isUserAdmin);
        let post = {
            id = nextPostId;
            title = title;
            content = content;
            author = msg.caller;
            date = Time.now();
            imageUrl = imageUrl;
        };
        blogPosts.put(nextPostId, post);
        nextPostId += 1;
        return post.id;
    };

    public query func getPost(id: Nat) : async ?BlogPost {
        return blogPosts.get(id);
    };

    public query func getAllPosts() : async [BlogPost] {
        return Iter.toArray(blogPosts.vals());
    };

    // Admin management
    public shared(msg) func addAdmin(principal: Principal, role: Text) : async Bool {
        let isUserMasterAdmin = isMasterAdmin(msg.caller);
        assert(isUserMasterAdmin);
        if (role != "master" and role != "editor") {
            return false;
        };
        admins.put(principal, {
            principal = principal;
            role = role;
        });
        return true;
    };

    public query func isAdmin(principal: Principal) : async Bool {
        return admins.get(principal) != null;
    };

    private func isMasterAdmin(principal: Principal) : Bool {
        switch (admins.get(principal)) {
            case (?admin) admin.role == "master";
            case null false;
        };
    };

    // Token price management
    public func updateTokenPrice(price: Float) : async () {
        lastTokenPrice := price;
        lastUpdateTime := Time.now();
    };

    public query func getTokenPrice() : async (Float, Int) {
        return (lastTokenPrice, lastUpdateTime);
    };
}; 