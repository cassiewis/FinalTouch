package Website.EventRentals.model;

public class Review {
    private String author;
    private String content;
    private int rating;
    private String event;
    private String date;

    public Review(){}

    public Review(String author, String content, int rating, String event, String date) {
        this.author = author;
        this.content = content;
        this.rating = rating;
        this.event = event;
        this.date = date;
    }

    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public int getrating() {
        return rating;
    }
    public void setrating(int rating) {
        this.rating = rating;
    }
    public String getEvent() {
        return event;
    }
    public void setEvent(String event) {
        this.event = event;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

}